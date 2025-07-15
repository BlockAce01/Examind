import React from 'react';

interface BadgeProps {
    Name: string;
    Description: string;
    IconURL?: string;
    Tier?: 'Bronze' | 'Silver' | 'Gold';
}

const Badge: React.FC<BadgeProps> = ({ Name, Description, IconURL, Tier }) => {
    const tierColor = {
        Bronze: 'bg-yellow-600',
        Silver: 'bg-gray-400',
        Gold: 'bg-yellow-400',
    };

    return (
        <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md">
            {IconURL ? (
                <img src={IconURL} alt={`${Name} badge`} className="w-12 h-12 mr-4" />
            ) : (
                <div className={`w-12 h-12 mr-4 rounded-full ${Tier ? tierColor[Tier] : 'bg-gray-300'}`} />
            )}
            <div>
                <h4 className="font-bold text-lg">{Name}</h4>
                <p className="text-sm text-gray-600">{Description}</p>
            </div>
        </div>
    );
};

export default Badge;
