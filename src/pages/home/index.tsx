'use client';

import React, { Fragment } from 'react';
import { ArrowDownIcon, ArrowUpIcon, BellIcon, SearchIcon, SettingsIcon } from 'lucide-react';
import { Bar, BarChart, Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Fake data for charts
const materialData = [
  { name: 'Fabric', value: 45 },
  { name: 'Buttons', value: 30 },
  { name: 'Zippers', value: 42 },
  { name: 'Thread', value: 18 },
  { name: 'Labels', value: 25 },
  { name: 'Elastic', value: 52 },
  { name: 'Lining', value: 48 }
];

const productionData = [
  { name: 'T-Shirts', value: 180 },
  { name: 'Jeans', value: 165 },
  { name: 'Dresses', value: 145 },
  { name: 'Jackets', value: 240 },
  { name: 'Skirts', value: 160 },
  { name: 'Sweaters', value: 120 },
  { name: 'Shorts', value: 190 },
  { name: 'Blouses', value: 170 }
];

const weeklyProductionData = Array.from({ length: 9 }, (_, i) => ({
  product: `Product ${i + 1}`,
  w1: Math.floor(Math.random() * 100),
  w2: Math.floor(Math.random() * 100),
  w3: Math.floor(Math.random() * 100),
  w4: Math.floor(Math.random() * 100),
  w5: Math.floor(Math.random() * 100),
  w6: Math.floor(Math.random() * 100),
  w7: Math.floor(Math.random() * 100)
}));

export default function Home() {
  return (
    <div className="flex flex-col h-[2000px]">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="relative w-96">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="w-full bg-muted pl-8" placeholder="Search..." type="search" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <BellIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <img src="/placeholder-user.jpg" alt="Avatar" className="rounded-full" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">TOTAL PRODUCTION</CardTitle>
              <Button variant="outline" size="sm">
                View
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84,521 units</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                12% increase from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RAW MATERIAL STOCK</CardTitle>
              <Button variant="outline" size="sm">
                View
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">159,258 units</div>
              <p className="text-xs text-muted-foreground">5% above optimal level</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QUALITY RATE</CardTitle>
              <Button variant="outline" size="sm">
                View
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                1.5% improvement
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Production Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-8 gap-2">
                <div className="font-medium">Products</div>
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="font-medium text-center">
                    W{i + 1}
                  </div>
                ))}
                {weeklyProductionData.map((row, i) => (
                  <React.Fragment key={i}>
                    <div className="text-sm">{row.product}</div>
                    {Object.entries(row)
                      .filter(([key]) => key.startsWith('w'))
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="rounded"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${value / 100})`,
                            height: '24px'
                          }}
                        />
                      ))}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Raw Material Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 grid-rows-3 gap-2 h-[300px]">
                {materialData.map((material, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-2 text-white"
                    style={{
                      backgroundColor: `hsl(${(i * 40) % 360}, 70%, 60%)`,
                      gridRow: i < 2 ? 'span 2' : 'span 1'
                    }}>
                    <div className="font-medium">{material.name}</div>
                    <div className="text-sm opacity-80">{material.value}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Production Overview</CardTitle>
              <Button size="sm">Export</Button>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  production: {
                    label: 'Production',
                    color: 'hsl(142, 76%, 36%)'
                  }
                }}
                className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(142, 76%, 36%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Total Production</div>
                  <div className="text-2xl font-bold">84,521 units</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Efficiency Rate</div>
                  <div className="text-2xl font-bold">92.5%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">On-Time Delivery</div>
                  <div className="text-2xl font-bold">98.2%</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Defect Rate</div>
                  <div className="text-2xl font-bold">1.5%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Section Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-12 rounded-lg ${
                      Math.random() > 0.5 ? 'bg-green-200' : 'bg-green-100'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-100" />
                  <span className="text-sm">Available Space</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-200" />
                  <span className="text-sm">Occupied Space</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Raw Material Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  stock: {
                    label: 'Stock',
                    color: 'hsl(252, 76%, 54%)'
                  }
                }}
                className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={materialData}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="hsl(252, 76%, 54%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Production Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {productionData && productionData.length > 0 && (
                <ChartContainer
                  config={{
                    value: {
                      label: 'Units',
                      color: 'hsl(252, 76%, 54%)'
                    }
                  }}
                  className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={productionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        fill="hsl(252, 76%, 54%)"
                        fillOpacity={0.2}
                        stroke="hsl(252, 76%, 54%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
