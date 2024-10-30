import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/textarea"

interface Product {
  id: string;
  name: string;
  image: string;
  branchStock: number;
  actualStock: number;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "KỆ SÁCH HÌNH CÂY 5 TẦNG GỖ MDF ĐẸ",
    image: "/placeholder.svg?height=50&width=50",
    branchStock: 150,
    actualStock: 150
  },
  {
    id: "2",
    name: "Tủ Đầu Giường 3 Ngăn Tủ Phong Cách Hiện Đại Bằng Gỗ MDF- GỖ LÁP",
    image: "/placeholder.svg?height=50&width=50",
    branchStock: 11,
    actualStock: 15
  }
]

export default function StocktakingDetails() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [notes, setNotes] = useState("")

  const totalActualStock = products.reduce((sum, product) => sum + product.actualStock, 0)
  const totalBranchStock = products.reduce((sum, product) => sum + product.branchStock, 0)
  const totalDifference = totalActualStock - totalBranchStock

  const handleStockChange = (id: string, value: number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, actualStock: value } : product
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Phiếu kiểm hàng #K020124FE315U</h1>
        <div>
          <Button variant="default" className="mr-2">Tìm kiếm</Button>
          <Button variant="outline" className="mr-2">Sửa phiếu kiểm hàng</Button>
          <Button variant="destructive">Xóa phiếu kiểm hàng</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            {products.map(product => (
              <div key={product.id} className="flex items-center mb-4 border-b pb-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p>Tồn chi nhánh: {product.branchStock}</p>
                  <div className="flex items-center mt-2">
                    <Input
                      type="number"
                      value={product.actualStock}
                      onChange={(e) => handleStockChange(product.id, parseInt(e.target.value))}
                      className="w-24 mr-2"
                    />
                    <span>Chênh lệch: {product.actualStock - product.branchStock}</span>
                  </div>
                </div>
              </div>
            ))}
            <Textarea
              placeholder="Ghi chú"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-4"
            />
            <Button className="mt-4 w-full">Cân bằng kho</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin phiếu kiểm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <p>Tạo ngày:</p>
              <p>2024-01-02 14:54</p>
              <p>Tạo bởi:</p>
              <p>Chintbv</p>
              <p>Chi nhánh:</p>
              <p>Chi nhánh mặc định</p>
              <p>Trạng thái:</p>
              <p>Đã kiểm kho</p>
            </div>
            <div className="mt-4">
              <p>SL tồn thực tế: {totalActualStock}</p>
              <p>SL tồn chi nhánh: {totalBranchStock}</p>
              <p>SL chênh lệch: {totalDifference}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}