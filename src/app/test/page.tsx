import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-8">
      <Card className="p-8 max-w-md w-full space-y-6 shadow-lg border border-gray-200">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">Tailwind CSS Test</h1>
        <p className="text-lg text-center text-gray-700 mb-4">
          If you see colors, rounded corners, and spacing, Tailwind CSS is working!
        </p>
        <div className="flex flex-col gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">Success</span>
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">Error</span>
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">Warning</span>
        </div>
      </Card>
    </div>
  );
} 