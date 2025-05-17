import Image from 'next/image';

export default function AboutUs() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">About Monventa</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Revolutionizing campus lost and found with innovative technology and a commitment to community service.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Monventa is a dedicated team of innovators and problem-solvers committed to transforming the way universities handle lost and found items. We understand the challenges students face when they lose their belongings and the administrative burden on university staff.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How Monventa Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <Image
                  src={`/images/tutorial${step}.png`}
                  alt={`Tutorial Step ${step}`}
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="mt-4 text-lg font-medium">
                  {step === 1 && 'Log in to school portal'}
                  {step === 2 && 'Look for your lost item'}
                  {step === 3 && 'Locate your item'}
                  {step === 4 && 'Collect item at location'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To simplify the lost and found process on college campuses, making it easier for students to recover their belongings and for administrators to manage lost items efficiently. We strive to create a seamless, transparent, and user-friendly experience that benefits everyone in the university community.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
} 