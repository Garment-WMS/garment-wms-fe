import { Link } from 'react-router-dom';
import Import1 from '@/assets/images/import-1.svg';
import Import2 from '@/assets/images/import-2.svg';
import Import3 from '@/assets/images/import-3.svg';
import Import4 from '@/assets/images/import-4.svg';
import Import5 from '@/assets/images/import-5.svg';
import Import6 from '@/assets/images/import-6.svg';

const CreateImportRequestMenu: React.FC = () => {
  const items = [
    {
      label: 'Material with Purchase Order',
      image: Import1,
      link: '/import-request/create/material'
    },
    { label: 'Return Material', image: Import2, link: '/return-material' },
    { label: 'Product with Manufacturing Order', image: Import4, link: '/product-by-mo' },
    { label: 'Return Product', image: Import5, link: '/return-product' }
  ];

  return (
    <div className="h-full w-full px-4 flex flex-col gap-4 bg-white items-center p-8">
      {/* Title */}
      <div
        className="font-extrabold font-primary flex justify-center text-bluePrimary text-md mb-8
        md:text-3xl">
        SELECT IMPORT REQUEST TYPE
      </div>

      {/* Grid of Import Request Types with Images */}
      <div className="grid grid-cols-2 gap-8">
        {items.map((item, index) => (
          <Link to={item.link} key={index} className="cursor-pointer">
            <div
              className="flex flex-col items-center justify-center border border-gray-400 rounded-lg text-blue-500 p-4 aspect-square 
              hover:bg-blue-500 hover:text-white transition-colors duration-300 cursor-pointer">
              <img src={item.image} alt={item.label} className="w-56 h-56 mb-4" />
              <h3 className="font-bold text-l">{item.label}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CreateImportRequestMenu;
