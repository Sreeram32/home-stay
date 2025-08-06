import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, ArrowLeft, ShoppingCart } from "lucide-react"

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Organic Honey",
      price: "₹2,074",
      image: "/placeholder.svg?height=250&width=250",
      description: "Pure wildflower honey from our beehives",
      category: "Pantry",
      inStock: true,
      organic: true,
    },
    {
      id: 2,
      name: "Fresh Herbs Bundle",
      price: "₹1,078",
      image: "/placeholder.svg?height=250&width=250",
      description: "Basil, rosemary, thyme, and oregano",
      category: "Fresh Produce",
      inStock: true,
      organic: true,
    },
    {
      id: 3,
      name: "Seasonal Vegetables",
      price: "₹1,576",
      image: "/placeholder.svg?height=250&width=250",
      description: "Farm-fresh seasonal produce basket",
      category: "Fresh Produce",
      inStock: true,
      organic: true,
    },
    {
      id: 4,
      name: "Artisan Goat Cheese",
      price: "₹1,410",
      image: "/placeholder.svg?height=250&width=250",
      description: "Creamy goat cheese made from our happy goats",
      category: "Dairy",
      inStock: true,
      organic: true,
    },
    {
      id: 5,
      name: "Free-Range Eggs",
      price: "₹746",
      image: "/placeholder.svg?height=250&width=250",
      description: "Fresh eggs from our pasture-raised chickens",
      category: "Dairy",
      inStock: true,
      organic: true,
    },
    {
      id: 6,
      name: "Lavender Essential Oil",
      price: "₹2,738",
      image: "/placeholder.svg?height=250&width=250",
      description: "Pure lavender oil distilled from our fields",
      category: "Wellness",
      inStock: false,
      organic: true,
    },
  ]

  const categories = ["All", "Fresh Produce", "Dairy", "Pantry", "Wellness"]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">GreenVale Farm</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600">
                Home
              </Link>
              <Link href="/products" className="text-gray-900 hover:text-green-600 font-medium">
                Products
              </Link>
              <Link href="/accommodations" className="text-gray-700 hover:text-green-600">
                Stay
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600">
                Contact
              </Link>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart (0)
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/" className="text-green-600 hover:text-green-700 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Products</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Farm Fresh Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All our products are grown and produced on our farm using sustainable, organic practices. From field to
            table, we ensure the highest quality and freshness.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className={
                category === "All"
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.organic && <Badge className="bg-green-600">Organic</Badge>}
                  {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">{product.price}</span>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={!product.inStock}>
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Farm Practices Info */}
        <div className="mt-16 bg-green-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Farming Practices</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              We believe in sustainable agriculture that respects the land and produces the healthiest food possible.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">100% Organic</h3>
              <p className="text-gray-600 text-sm">No synthetic pesticides, herbicides, or fertilizers used</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Sustainable Methods</h3>
              <p className="text-gray-600 text-sm">Crop rotation, composting, and natural pest management</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Local & Fresh</h3>
              <p className="text-gray-600 text-sm">Harvested daily and delivered within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
