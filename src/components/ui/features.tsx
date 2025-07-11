import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';

const features = [
  {
    title: 'Secure Registration',
    description:
      'Create your account with email and password validation. Our system ensures your credentials are safely encrypted and stored.',
    icon: '🔐',
  },
  {
    title: 'Fast Login',
    description:
      'Quick and secure login process with session management. Access your dashboard instantly after authentication.',
    icon: '⚡',
  },
  {
    title: 'Protected Dashboard',
    description:
      'Access your personalized dashboard with route protection. Only authenticated users can view protected content.',
    icon: '🛡️',
  },
  {
    title: 'Modern UI',
    description:
      'Clean and responsive design built with shadcn/ui and Tailwind CSS. Optimized for all devices and screen sizes.',
    icon: '✨',
  },
];

export function Features() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for user authentication
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Built with modern technologies and best practices to provide a
            secure and seamless user experience.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
            {features.map(feature => (
              <Card
                key={feature.title}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
