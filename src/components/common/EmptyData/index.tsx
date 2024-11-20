import emptyImg from '@/assets/images/empty.svg';

const EmptyDatacomponent = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <img src={emptyImg} alt="" width={150} height={150} className="mb-4" />
      <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-200 capitalize">
        No data available
      </h2>
    </div>
  );
};

export default EmptyDatacomponent;
