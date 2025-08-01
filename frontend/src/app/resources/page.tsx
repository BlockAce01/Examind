'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceItem from '@/components/resources/ResourceItem';
import { type Resource } from '@/types/resource';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

// get unique value
const getUniqueValues = (items: Resource[], key: keyof Resource) => {
    const values = items.map(item => item[key]).filter(Boolean);
    // Set works correctly with potential mixed types
    return Array.from(new Set(values as (string | number)[]));
}

export default function ResourcesPage() {
    //State Variables
    const [resources, setResources] = useState<Resource[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedType, setSelectedType] = useState('');

    // Get user role from auth context
    const { user } = useAuth();
    const isAdminOrTeacher = user?.Role === 'teacher' || user?.Role === 'admin';

    //Data Fetching
    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                // Add query params for API filter
                const response = await fetch(`${apiUrl}/api/v1/resources`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.status === 'success' && Array.isArray(data.data?.resources)) {
                    //API data matches Resource[] type
                    setResources(data.data.resources);
                } else {
                     throw new Error(data.message || 'Invalid API response format');
                }
            } catch (err: any) {
                console.error("Failed to fetch resources:", err);
                setError(err.message || 'Could not load resources.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchResources();
    }, []); 

    //Client Side Filter
    const filteredResources = resources.filter(resource => {
        // Use correct casing
        const matchesSearchTerm = searchTerm === '' ||
            resource.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (resource.Description && resource.Description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesSubject = selectedSubject === '' || resource.Subject === selectedSubject;
        const matchesType = selectedType === '' || resource.Type === selectedType;
        return matchesSearchTerm && matchesSubject && matchesType;
    });

     //Get unique options for filters 
    const uniqueSubjects = getUniqueValues(resources, 'Subject');
    const uniqueTypes = getUniqueValues(resources, 'Type');

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Learning Resources</h1>

            {/* Filter and Search UI */}
             <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className='flex-grow'>
                    <label htmlFor="search" className="sr-only">Search Resources</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    />
                </div>
                {/* Filter Dropdown */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="p-2 border rounded bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        aria-label="Filter by subject"
                    >
                        <option value="">All Subjects</option>
                        {uniqueSubjects.map((subject, index) => (
                            <option key={index} value={subject as string}>{subject as string}</option>
                        ))}
                    </select>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                         className="p-2 border rounded bg-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
                         aria-label="Filter by type"
                    >
                        <option value="">All Types</option>
                        {uniqueTypes.map((type, index) => (
                              <option key={index} value={type as string}>{type as string}</option>
                         ))}
                    </select>
                     <Button
                        variant='secondary'
                        onClick={() => { setSearchTerm(''); setSelectedSubject(''); setSelectedType(''); }}
                        disabled={!searchTerm && !selectedSubject && !selectedType}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear All
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                   <Spinner size="lg" />
                </div>
            ) : error ? (
                <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <p><strong>Error:</strong> {error}</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[200px]">
                    {filteredResources.length > 0 ? (
                        <div>
                            {filteredResources.map((resource) => (
                                // Pass resource match Resource type
                                <ResourceItem key={resource.ResourceID} resource={resource} />
                            ))}
                        </div>
                    ) : (
                         <EmptyState title="No Resources Found" message="Try adjusting your search terms or filters, or check back later." />
                    )}
                </div>
            )}

            {/* Add Button  */}
            {isAdminOrTeacher && (
                <div className="mt-6 text-right">
                    <Link href="/admin/resources/new">
                         <Button variant="primary" className="bg-green-600 hover:bg-green-700">
                            + Add New Resource
                         </Button>
                    </Link>
                 </div>
             )}
        </div>
    );
}
