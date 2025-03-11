import React from 'react';

export interface FeatureCardProps {
  /**
   * The icon to display in the feature card
   */
  icon: React.ElementType;
  /**
   * Feature title text
   */
  title: string;
  /**
   * Feature description text
   */
  description: string;
}

/**
 * A card component for displaying features with an icon, title, and description
 */
export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) => (
  <div className="card p-6 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-amber-700" />
    </div>
    <h3 className="text-xl font-serif font-bold text-amber-800 mb-2">
      {title}
    </h3>
    <p className="text-stone-600">{description}</p>
  </div>
);

export default FeatureCard;
