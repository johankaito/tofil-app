import React from 'react';

export default function OnboardingPage() {
  // Placeholder: Replace with actual user context logic
  const user = { type: 'OWNER' };

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white dark:bg-zinc-900 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Onboarding</h1>
      {user.type === 'OWNER' && (
        <form>
          <label className="block mb-2">Company Name</label>
          <input className="w-full mb-4 p-2 border rounded" placeholder="Enter your company name" />
          {/* Add more owner-specific fields here */}
          <button className="btn btn-primary w-full">Complete Onboarding</button>
        </form>
      )}
      {user.type === 'CONTRACTOR' && (
        <form>
          <label className="block mb-2">Skills</label>
          <input className="w-full mb-4 p-2 border rounded" placeholder="List your skills" />
          {/* Add more contractor-specific fields here */}
          <button className="btn btn-primary w-full">Complete Onboarding</button>
        </form>
      )}
      {user.type === 'MANAGER' && (
        <form>
          <label className="block mb-2">Department</label>
          <input className="w-full mb-4 p-2 border rounded" placeholder="Enter your department" />
          {/* Add more manager-specific fields here */}
          <button className="btn btn-primary w-full">Complete Onboarding</button>
        </form>
      )}
    </div>
  );
} 