interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage = 'https://images.pexels.com/photos/1435895/pexels-photo-1435895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
}) => {
  return (
    <div
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 fade-in">{title}</h1>
        {subtitle && (
          <p className="text-xl text-stone-100 max-w-2xl mx-auto fade-in">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
