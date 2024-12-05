import privateCall from '@/api/PrivateCaller';
import { productVariantApi } from '@/api/services/productApi';
import Loading from '@/components/common/Loading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/Label';
import { toast } from '@/hooks/use-toast';
import { ProductVariant } from '@/types/ProductType';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import General from './components/General';
import ImageUploadWithDialog from '@/pages/Material/MaterialDetails/components/ImageUpload';
import SizeTable from './components/SizeTable';
import Attributes from './components/Attributes';
import ReceiptTable from './components/ReceiptTable';
import ProductSizeAndFormula from './components/ProductSizeAndFormula';

type Props = {};

const ProductVariantDetails = (props: Props) => {
  const { id,receiptId } = useParams<{ id: string ,receiptId: string}>();
  const [isLoading, setIsLoading] = useState(false);
  const [productVariant, setProductVariant] = useState<ProductVariant>();

  const fetchProductVariant = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await privateCall(productVariantApi.getOneProductVariant(id));
      if (res.status === 200) {
        setProductVariant(res.data.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to fetch product variant',
        title: 'Error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (!id) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-lg font-semibold">Nothing to display</p>
      </div>
    );
  }
  useEffect(() => {
    fetchProductVariant(id);
  }, []);
  const handleUploadPhoto = async (file: File) => {
    if (!id) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const config = {
          'Content-Type': 'multipart/form-data',
      };
      await privateCall(productVariantApi.uploadImage(id, formData,config));
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to upload image',
        title: 'Error'
      });
    }
  };

  const getProductSize = () => {
    if (!productVariant) {
      return [];
    }
    const productSize = productVariant.productSize || [];
    const formatProductSize = productSize.map((size) => ({
      ...size,
      uom: productVariant.product.productUom
    }));
    return formatProductSize;
  };

  const formatProductSize = getProductSize();
  const attribute = productVariant?.productAttribute;
  const productSize = productVariant?.productSize || [];

  if (!productVariant) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-lg font-semibold">Nothing to display</p>
      </div>
    );
  }
  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Loading />
        </div>
      ) : productVariant ? (
        <div className="container mx-auto p-6 w-full bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Product Variant Details</h1>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-primary font-semibold">
                {productVariant?.name || 'No name available'}
              </h2>
              {/* <div className="w-28 h-28">
              {material?.image ? (
                <img src={material?.image} alt="" />
              ) : (
                <img src={placeHolder} alt="Placeholder" />
              )}
            </div> */}
              <ImageUploadWithDialog
                initialImage={productVariant.image || undefined}
                onImageUpload={handleUploadPhoto}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Accordion
                type="multiple"
                defaultValue={['item-1', 'item-2', 'item-3', 'item-4']}
                className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <Label className="text-xl">General Information</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <General productVariant={productVariant}/>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <Label className="text-xl">Sizes and Formulas</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProductSizeAndFormula productSizes={productSize}/>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    <Label className="text-xl">Attributes</Label>
                  </AccordionTrigger>
                  <AccordionContent><Attributes/></AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    <Label className="text-xl">Receipt</Label>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ReceiptTable receiptId={receiptId} id={productVariant.id}/>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <p className="text-lg font-semibold">Nothing to display</p>
        </div>
      )}
    </>
  );
};

export default ProductVariantDetails;
