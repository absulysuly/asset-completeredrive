'use client';

import React from 'react';
// TODO: Import compass components once import paths are fixed
// import { CategoryGrid } from '@/components/compass/CategoryGrid';
// import { GovernorateFilter } from '@/components/compass/GovernorateFilter';

export default function CompassPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Iraq Compass</h1>

        {/* TODO: Add governorate filter */}
        {/* <GovernorateFilter /> */}

        {/* TODO: Add category grid */}
        {/* <CategoryGrid /> */}

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Iraq Compass - Category Grid Coming Soon
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Components have been copied to components/compass/
            <br />
            Need to fix import paths and integrate with Next.js app
          </p>
        </div>
      </div>
    </div>
  );
}
