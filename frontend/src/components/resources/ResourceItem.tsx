// src/components/resources/ResourceItem.tsx
import React from 'react';
import Link from 'next/link';
import { DocumentTextIcon, VideoCameraIcon, ClipboardDocumentListIcon, CalendarDaysIcon, TagIcon, IdentificationIcon, LinkIcon } from '@heroicons/react/24/outline';
// Import the shared type
import { type Resource } from '@/types/resource'; // Adjust path if needed

interface ResourceItemProps {
  resource: Resource; // Use the shared type
}

// Helper function to get an icon based on resource type
const getIconForType = (type: Resource['Type']) => {
    switch (type) {
        case 'Past Paper':
        case 'Model Paper':
            return <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />;
        case 'Notes':
            return <DocumentTextIcon className="w-6 h-6 text-green-600" />;
        case 'Video Lecture':
            return <VideoCameraIcon className="w-6 h-6 text-purple-600" />;
        default:
            return <IdentificationIcon className="w-6 h-6 text-gray-500" />;
    }
};

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => {

    let uploadedDateFormatted = 'N/A';
    if (resource.UploadedDate) {
        try {
            uploadedDateFormatted = new Date(resource.UploadedDate).toLocaleDateString();
        } catch (e) {
            console.error("Invalid UploadedDate format:", resource.UploadedDate);
        }
    }

    return (
        <div className="flex items-start space-x-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-150">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
                {getIconForType(resource.Type)}
            </div>

            {/* Resource Details */}
            <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {/* Use <a> tag for file URLs */}
                    <a
                        href={resource.FileURL} // Use correct casing
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-700 hover:underline"
                        title={`Open ${resource.Title}`} // Use correct casing
                    >
                        {resource.Title} {/* Use correct casing */}
                    </a>
                </h3>
                {/* Use correct casing */}
                {resource.Description && (
                    <p className="text-sm text-gray-600 mb-2">{resource.Description}</p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded">
                        <IdentificationIcon className="w-3 h-3 mr-1"/> {resource.Type} {/* Use correct casing */}
                    </span>
                    <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded">
                        <TagIcon className="w-3 h-3 mr-1"/> {resource.Subject} {/* Use correct casing */}
                    </span>
                    {/* Use correct casing */}
                    {resource.Year && (
                        <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded">
                            <CalendarDaysIcon className="w-3 h-3 mr-1" /> Year: {resource.Year}
                        </span>
                    )}
                    <span className="flex items-center bg-gray-100 px-2 py-0.5 rounded">
                        <CalendarDaysIcon className="w-3 h-3 mr-1" /> Added: {uploadedDateFormatted}
                    </span>
                </div>
            </div>
            {/* Optional Action Button placeholder */}
        </div>
    );
};

export default ResourceItem;