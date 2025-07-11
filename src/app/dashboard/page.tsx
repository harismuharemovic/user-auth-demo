'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Search,
  Settings,
  BarChart3,
  ShoppingCart,
  Users,
  Package,
  LogOut,
  Filter,
  Download,
  CreditCard,
  Plus,
  Minus,
} from 'lucide-react';

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  status: string;
  total_amount: number;
  created_at: string;
  items?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  same_as_billing: boolean;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  customer_phone: string;
}

interface Statistics {
  thisWeek: {
    total: number;
    growth: number;
    percentage: number;
  };
  thisMonth: {
    total: number;
    growth: number;
    percentage: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>({
    thisWeek: { total: 0, growth: 0, percentage: 0 },
    thisMonth: { total: 0, growth: 0, percentage: 0 },
  });

  const products = [
    { id: 'glimmer-lamps', name: 'Glimmer Lamps', price: 125.0 },
    { id: 'aqua-filters', name: 'Aqua Filters', price: 49.0 },
    { id: 'solar-panels', name: 'Solar Panels', price: 299.0 },
    { id: 'smart-thermostat', name: 'Smart Thermostat', price: 179.0 },
  ];

  const [orderForm, setOrderForm] = useState({
    customer: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    sameAsBilling: true,
    items: [{ product: products[0].id, quantity: 1, price: products[0].price }],
  });

  // Date calculation functions
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const calculateStatistics = (orders: Order[]): Statistics => {
    const now = new Date();
    const thisWeekStart = getWeekStart(now);
    const thisMonthStart = getMonthStart(now);

    // Previous periods for comparison
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);

    const lastMonthStart = new Date(thisMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    const lastMonthEnd = new Date(thisMonthStart);
    lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);

    // Filter orders by date ranges
    const thisWeekOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= thisWeekStart && orderDate <= now;
    });

    const lastWeekOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= lastWeekStart && orderDate <= lastWeekEnd;
    });

    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= thisMonthStart && orderDate <= now;
    });

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    });

    // Calculate totals
    const thisWeekTotal = thisWeekOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const lastWeekTotal = lastWeekOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const thisMonthTotal = thisMonthOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const lastMonthTotal = lastMonthOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    // Calculate growth percentages
    const weekGrowth =
      lastWeekTotal > 0
        ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100
        : 0;
    const monthGrowth =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

    // Calculate progress percentages (based on some target, let's use a simple calculation)
    const weekProgress = Math.min((thisWeekTotal / 500) * 100, 100); // Target: $500/week
    const monthProgress = Math.min((thisMonthTotal / 2000) * 100, 100); // Target: $2000/month

    return {
      thisWeek: {
        total: thisWeekTotal,
        growth: weekGrowth,
        percentage: weekProgress,
      },
      thisMonth: {
        total: thisMonthTotal,
        growth: monthGrowth,
        percentage: monthProgress,
      },
    };
  };

  // Load orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        const ordersData = data.orders || [];
        setOrders(ordersData);

        // Calculate statistics
        const stats = calculateStatistics(ordersData);
        setStatistics(stats);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        router.push('/auth');
      } else {
        console.error('Logout failed');
        router.push('/auth');
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/auth');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderForm),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Order created successfully:', result);

        // Reset form and close modal
        setOrderForm({
          customer: '',
          customerEmail: '',
          customerPhone: '',
          shippingAddress: '',
          shippingCity: '',
          shippingState: '',
          shippingZip: '',
          billingAddress: '',
          billingCity: '',
          billingState: '',
          billingZip: '',
          sameAsBilling: true,
          items: [
            { product: products[0].id, quantity: 1, price: products[0].price },
          ],
        });
        setIsModalOpen(false);

        // Refresh orders list
        await fetchOrders();
      } else {
        const errorData = await response.json();
        console.error('Failed to create order:', errorData.message);
        alert(`Failed to create order: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    const firstProduct = products[0];
    setOrderForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          product: firstProduct.id,
          quantity: 1,
          price: firstProduct.price,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (orderForm.items.length > 1) {
      setOrderForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    setOrderForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const customers = [
    { id: 'liam-johnson', name: 'Liam Johnson', email: 'liam@example.com' },
    { id: 'sarah-chen', name: 'Sarah Chen', email: 'sarah@example.com' },
    { id: 'mike-davis', name: 'Mike Davis', email: 'mike@example.com' },
    { id: 'emma-wilson', name: 'Emma Wilson', email: 'emma@example.com' },
  ];

  // Calculate total amount for display
  const calculateTotal = () => {
    return orderForm.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-8">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>

        <nav className="flex flex-col space-y-4 flex-1">
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Users className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <Package className="w-5 h-5" />
          </button>
        </nav>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg mt-auto"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="w-2 h-2 bg-gray-300 rounded-full mt-4"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Dashboard</span>
              <span>›</span>
              <span>Orders</span>
              <span>›</span>
              <span className="text-gray-900">Recent Orders</span>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex">
          {/* Left Section */}
          <div className="flex-1 p-6">
            {/* Your Orders Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Orders
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                Introducing Our Dynamic Orders Dashboard for
                <br />
                Seamless Management and Insightful Analysis.
              </p>

              {/* Create New Order Modal */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Create New Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                    <DialogDescription>
                      Fill out the form below to create a new order for your
                      customer.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Customer Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer">Customer</Label>
                        <Select
                          value={orderForm.customer}
                          onValueChange={value => {
                            const customer = customers.find(
                              c => c.id === value
                            );
                            setOrderForm(prev => ({
                              ...prev,
                              customer: value,
                              customerEmail: customer?.email || '',
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Customer Email</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          value={orderForm.customerEmail}
                          onChange={e =>
                            setOrderForm(prev => ({
                              ...prev,
                              customerEmail: e.target.value,
                            }))
                          }
                          placeholder="customer@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Customer Phone</Label>
                      <Input
                        id="customerPhone"
                        type="tel"
                        value={orderForm.customerPhone}
                        onChange={e =>
                          setOrderForm(prev => ({
                            ...prev,
                            customerPhone: e.target.value,
                          }))
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Order Items
                        </Label>
                        <Button
                          type="button"
                          onClick={addItem}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>

                      {orderForm.items.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-4 items-start"
                        >
                          <div className="col-span-6 space-y-2">
                            <Label>Product</Label>
                            <Select
                              value={item.product}
                              onValueChange={value => {
                                const product = products.find(
                                  p => p.id === value
                                );
                                updateItem(index, 'product', value);
                                updateItem(index, 'price', product?.price || 0);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map(product => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}
                                  >
                                    {product.name} - ${product.price}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="col-span-2 space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={e =>
                                updateItem(
                                  index,
                                  'quantity',
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          </div>

                          <div className="col-span-3 space-y-2">
                            <Label>Price</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={e =>
                                updateItem(
                                  index,
                                  'price',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </div>

                          <div className="col-span-1 h-[58px] flex items-end justify-center">
                            {orderForm.items.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeItem(index)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 cursor-pointer"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Order Total */}
                      <div className="flex justify-end">
                        <div className="text-lg font-semibold">
                          Total: ${calculateTotal().toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">
                        Shipping Address
                      </Label>
                      <div className="grid grid-cols-1 gap-4">
                        <Input
                          placeholder="Street Address"
                          value={orderForm.shippingAddress}
                          onChange={e =>
                            setOrderForm(prev => ({
                              ...prev,
                              shippingAddress: e.target.value,
                            }))
                          }
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="City"
                            value={orderForm.shippingCity}
                            onChange={e =>
                              setOrderForm(prev => ({
                                ...prev,
                                shippingCity: e.target.value,
                              }))
                            }
                          />
                          <Input
                            placeholder="State"
                            value={orderForm.shippingState}
                            onChange={e =>
                              setOrderForm(prev => ({
                                ...prev,
                                shippingState: e.target.value,
                              }))
                            }
                          />
                          <Input
                            placeholder="ZIP Code"
                            value={orderForm.shippingZip}
                            onChange={e =>
                              setOrderForm(prev => ({
                                ...prev,
                                shippingZip: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sameAsBilling"
                          checked={orderForm.sameAsBilling}
                          onChange={e =>
                            setOrderForm(prev => ({
                              ...prev,
                              sameAsBilling: e.target.checked,
                            }))
                          }
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="sameAsBilling">
                          Billing address same as shipping
                        </Label>
                      </div>

                      {!orderForm.sameAsBilling && (
                        <div className="space-y-4">
                          <Label className="text-base font-semibold">
                            Billing Address
                          </Label>
                          <div className="grid grid-cols-1 gap-4">
                            <Input
                              placeholder="Street Address"
                              value={orderForm.billingAddress}
                              onChange={e =>
                                setOrderForm(prev => ({
                                  ...prev,
                                  billingAddress: e.target.value,
                                }))
                              }
                            />
                            <div className="grid grid-cols-3 gap-4">
                              <Input
                                placeholder="City"
                                value={orderForm.billingCity}
                                onChange={e =>
                                  setOrderForm(prev => ({
                                    ...prev,
                                    billingCity: e.target.value,
                                  }))
                                }
                              />
                              <Input
                                placeholder="State"
                                value={orderForm.billingState}
                                onChange={e =>
                                  setOrderForm(prev => ({
                                    ...prev,
                                    billingState: e.target.value,
                                  }))
                                }
                              />
                              <Input
                                placeholder="ZIP Code"
                                value={orderForm.billingZip}
                                onChange={e =>
                                  setOrderForm(prev => ({
                                    ...prev,
                                    billingZip: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Creating...' : 'Create Order'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">This week</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-2">
                  ${statistics.thisWeek.total.toFixed(0)}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {statistics.thisWeek.growth >= 0 ? '+' : ''}
                  {statistics.thisWeek.growth.toFixed(1)}% from last week
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        statistics.thisWeek.percentage,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">This month</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-2">
                  ${statistics.thisMonth.total.toFixed(0)}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {statistics.thisMonth.growth >= 0 ? '+' : ''}
                  {statistics.thisMonth.growth.toFixed(1)}% from last month
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        statistics.thisMonth.percentage,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </Card>
            </div>

            {/* Time Period Tabs */}
            <div className="flex space-x-1 mb-4">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                Week
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Month
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                Year
              </button>
            </div>

            {/* Orders Table */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Orders
                  </h2>
                  <p className="text-sm text-gray-600">
                    Recent orders from your online store
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-gray-500">Loading orders...</div>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                          Type
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-gray-500"
                          >
                            No orders found. Create your first order!
                          </td>
                        </tr>
                      ) : (
                        orders.map(order => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {order.customer_name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {order.customer_email}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-900">Sale</td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-medium text-gray-900">
                              ${order.total_amount?.toFixed(2) || '0.00'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>

          {/* Right Section - Order Details */}
          <div className="w-96 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Track Order
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Recent orders from your online store
            </p>

            {/* Order Details */}
            <div className="space-y-6">
              {orders.length > 0 ? (
                <>
                  {/* Latest Order Details */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Order Details
                    </h3>
                    <div className="space-y-2">
                      {orders[0].items &&
                        orders[0].items.split(',').map((item, index) => {
                          const trimmedItem = item.trim();
                          return (
                            <div key={index} className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                {trimmedItem}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="text-sm text-gray-900">
                          ${orders[0].total_amount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Shipping</span>
                        <span className="text-sm text-gray-900">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tax</span>
                        <span className="text-sm text-gray-900">$0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="font-medium text-gray-900">
                          ${orders[0].total_amount?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">
                        Shipping Information
                      </h3>
                      <h3 className="font-medium text-gray-900">
                        Billing Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-900 font-medium">
                          {orders[0].customer_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {orders[0].shipping_address}
                        </div>
                        <div className="text-sm text-gray-600">
                          {orders[0].shipping_city}, {orders[0].shipping_state}{' '}
                          {orders[0].shipping_zip}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          {orders[0].same_as_billing ? (
                            'Same as shipping address'
                          ) : (
                            <>
                              <div className="text-sm text-gray-900 font-medium">
                                {orders[0].customer_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {orders[0].billing_address}
                              </div>
                              <div className="text-sm text-gray-600">
                                {orders[0].billing_city},{' '}
                                {orders[0].billing_state}{' '}
                                {orders[0].billing_zip}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Customer</span>
                        <span className="text-sm text-gray-900">
                          {orders[0].customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm text-gray-900">
                          {orders[0].customer_email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm text-gray-900">
                          {orders[0].customer_phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">
                      Payment Information
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Visa</span>
                      </div>
                      <span className="text-sm text-gray-900">
                        **** **** **** 4532
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">No orders available</div>
                  <div className="text-sm text-gray-400">
                    Create your first order to see details here
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
