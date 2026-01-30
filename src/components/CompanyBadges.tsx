interface CompanyBadgesProps {
  companies?: string[];
}

// Default companies if none provided
const defaultCompanies = [
  'drivvn',
  'Previous Company',
  'Earlier Company',
];

export default function CompanyBadges({ companies }: CompanyBadgesProps) {
  const displayCompanies = companies && companies.length > 0 ? companies : defaultCompanies;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {displayCompanies.map((company, index) => (
        <span key={index} className="company-badge">
          {company}
        </span>
      ))}
    </div>
  );
}
