import HotelSearch from '@/components/HotelSearch';

export default function HotelsPage() {
  return (
    <main className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Find Hotels!</h1>
      <HotelSearch />
    </main>
  );
}
