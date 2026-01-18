import Image from 'next/image';

interface MenuItemProps {
  name: string;
  description: string;
  price: number;
  image?: string;
}

const MenuItem = ({ name, description, price, image }: MenuItemProps) => {
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="w-24 h-24 flex-shrink-0 relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      )}
      <div className={`${image ? 'flex-1' : 'w-full'} p-4`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-medium">{name}</h4>
          <span className="font-semibold text-primary ml-2">{'\u00A3'}{price.toFixed(2)}</span>
        </div>
        <p className="text-stone-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default MenuItem;
