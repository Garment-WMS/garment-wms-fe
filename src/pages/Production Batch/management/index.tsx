import ProductionBatchIntroduction from './components/Introduction';
import ProductionBatchList from './components/ProductionBatchList';

const ProductionBatchManagement = () => {
  return (
    <div className="h-auto w-full px-4 py-3 flex flex-col space-y-3">
      {/* Introduction */}
      <ProductionBatchIntroduction />
      {/* Import Buttonm */}
      <div className="flex justify-end items-center mb-6">
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Plan
        </Button> */}
      </div>
      {/* Production Batch List */}
      <ProductionBatchList />
    </div>
  );
};

export default ProductionBatchManagement;
