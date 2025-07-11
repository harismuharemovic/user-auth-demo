import { NextRequest } from 'next/server';
import db from '@/lib/db';

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface CreateOrderRequestBody {
  customer: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  sameAsBilling: boolean;
  items: OrderItem[];
}

// Product lookup for validation and name resolution
const products = {
  'glimmer-lamps': { name: 'Glimmer Lamps', price: 125.0 },
  'aqua-filters': { name: 'Aqua Filters', price: 49.0 },
  'solar-panels': { name: 'Solar Panels', price: 299.0 },
  'smart-thermostat': { name: 'Smart Thermostat', price: 179.0 },
};

// Customer lookup for validation
const customers = {
  'liam-johnson': { name: 'Liam Johnson', email: 'liam@example.com' },
  'sarah-chen': { name: 'Sarah Chen', email: 'sarah@example.com' },
  'mike-davis': { name: 'Mike Davis', email: 'mike@example.com' },
  'emma-wilson': { name: 'Emma Wilson', email: 'emma@example.com' },
};

// GET - Fetch all orders
export async function GET(request: NextRequest) {
  try {
    const orders = await new Promise<any[]>((resolve, reject) => {
      const query = `
        SELECT 
          o.*,
          GROUP_CONCAT(
            oi.product_name || ' x ' || oi.quantity || ' ($' || oi.price || ')'
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });

    return Response.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequestBody = await request.json();
    const {
      customer,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      billingAddress,
      billingCity,
      billingState,
      billingZip,
      sameAsBilling,
      items,
    } = body;

    // Validate required fields
    if (
      !customer ||
      !customerEmail ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingZip
    ) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate items
    if (!items || items.length === 0) {
      return Response.json(
        { message: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Validate customer exists
    const customerData = customers[customer as keyof typeof customers];
    if (!customerData) {
      return Response.json(
        { message: 'Invalid customer selected' },
        { status: 400 }
      );
    }

    // Validate and process items
    let totalAmount = 0;
    const validatedItems: {
      product_id: string;
      product_name: string;
      quantity: number;
      price: number;
      total: number;
    }[] = [];

    for (const item of items) {
      if (!item.product || !item.quantity || !item.price) {
        return Response.json({ message: 'Invalid item data' }, { status: 400 });
      }

      const productData = products[item.product as keyof typeof products];
      if (!productData) {
        return Response.json(
          { message: `Invalid product: ${item.product}` },
          { status: 400 }
        );
      }

      const itemTotal = item.quantity * item.price;
      totalAmount += itemTotal;

      validatedItems.push({
        product_id: item.product,
        product_name: productData.name,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      });
    }

    // Create order in database
    const result = await new Promise<{
      success: boolean;
      orderId?: number;
      error?: string;
    }>(resolve => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert order
        const orderQuery = `
            INSERT INTO orders (
              customer_name, customer_email, customer_phone,
              shipping_address, shipping_city, shipping_state, shipping_zip,
              billing_address, billing_city, billing_state, billing_zip,
              same_as_billing, status, total_amount, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `;

        const orderValues = [
          customerData.name,
          customerEmail,
          customerPhone,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingZip,
          sameAsBilling ? null : billingAddress,
          sameAsBilling ? null : billingCity,
          sameAsBilling ? null : billingState,
          sameAsBilling ? null : billingZip,
          sameAsBilling ? 1 : 0,
          'fulfilled', // Set status to fulfilled to match the UI
          totalAmount,
        ];

        db.run(orderQuery, orderValues, function (err) {
          if (err) {
            console.error('Error inserting order:', err);
            db.run('ROLLBACK');
            resolve({ success: false, error: 'Failed to create order' });
            return;
          }

          const orderId = this.lastID;

          // Insert order items
          const itemQuery = `
              INSERT INTO order_items (
                order_id, product_id, product_name, quantity, price, total, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `;

          let itemsInserted = 0;
          let hasError = false;

          for (const item of validatedItems) {
            db.run(
              itemQuery,
              [
                orderId,
                item.product_id,
                item.product_name,
                item.quantity,
                item.price,
                item.total,
              ],
              function (err) {
                if (err && !hasError) {
                  console.error('Error inserting order item:', err);
                  hasError = true;
                  db.run('ROLLBACK');
                  resolve({
                    success: false,
                    error: 'Failed to create order items',
                  });
                  return;
                }

                itemsInserted++;
                if (itemsInserted === validatedItems.length && !hasError) {
                  db.run('COMMIT');
                  resolve({ success: true, orderId });
                }
              }
            );
          }
        });
      });
    });

    if (!result.success) {
      return Response.json(
        { message: result.error || 'Failed to create order' },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: 'Order created successfully',
        orderId: result.orderId,
        totalAmount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);

    if (error instanceof SyntaxError) {
      return Response.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
