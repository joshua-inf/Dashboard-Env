'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Smartphone, Wallet, Receipt, X, User, Mail, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types/product';
import { getOrgData } from '@/lib/createCookie';
import { getAllProducts } from '@/services/apiProducts';
import { ProductCard } from './components/ProductCard';
import { CartPaymentSection } from './components/CartPaymentSection';
import { makeOrderByMainUser } from '@/services/order/Order';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import OrdersManagement from '@/app/orders/page';
import { LoadingDialog } from './components/LoadingDialog';
import { SuccessDialog } from './components/SuccessDialogProps ';
import { FailedDialog } from './components/FailedDialog ';
import { Customers } from '@/types/Customers';



export interface CartItem {
    product: Product
    quantity: number
    subtotal: number

}

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>();
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paystatus, setPayStatus] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [paymentStep, setPaymentStep] = useState<string>('cart');
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [cashAmount, setCashAmount] = useState('');
    const [changeAmount, setChangeAmount] = useState(0);
    // const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const businessData = getOrgData()
    const userData = useSelector((state: RootState) => state.userDetails)

    const [payableUserData, setPayableUSerData] = useState<Partial<Customers>>(userData)

    const categories = ['All', ...new Set(products?.map(p => p.category))];

    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, subtotal: product.price }];
        });
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
                    : item
            )
        );
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const processPayment = async () => {
        setLoading(true)
        setPayableUSerData({...payableUserData, business_id: businessData.id})

        
        try {
            let orederResponse = await makeOrderByMainUser(cart, payableUserData, businessData.id)
            if (orederResponse) {
                console.log("data stored successfully")
                setPayStatus('success')
            } else {
                setPayStatus("failed")
                // console.log("faied to store data")
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            // setPayStatus("failed")
            setLoading(false)
        } finally {
            setPayableUSerData({})
            setCart([])
        }

    };

    const calculateChange = (amount: string) => {
        const cash = parseFloat(amount) || 0;
        setCashAmount(amount);
        // setChangeAmount(cash - total);
    };

    const getProducts = () => {
        getAllProducts(businessData?.id)
            .then((res) => {
                if (res) {
                    setProducts(res)
                }
            })
    }


    useEffect(() => {
        getProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <LoadingDialog
                isOpen={loading}
            />
            <SuccessDialog
                isOpen={paystatus == "success"}
                onClose={() => setPayStatus("")}
            />
            <FailedDialog
                isOpen={paystatus == "failed"}
                onClose={() => setPayStatus("")}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your sales and transactions</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Products Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Search and Filter */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Products Grid */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Products</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredProducts?.map((product, key) => (
                                        <ProductCard key={key} product={product} addToCart={addToCart} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cart & Payment Section */}
                        <CartPaymentSection
                            cart={cart}
                            setPayableUSerData={setPayableUSerData}
                            setCart={setCart}
                            customerName={customerName}
                            customerEmail={customerEmail}
                            setCustomerName={setCustomerName}
                            setCustomerEmail={setCustomerEmail}
                            updateQuantity={updateQuantity}
                            changeAmount={changeAmount}
                            calculateChange={calculateChange}
                            removeFromCart={removeFromCart}
                            paymentStep={paymentStep}
                            selectedPayment={selectedPayment}
                            setPaymentStep={setPaymentStep}
                            cashAmount={cashAmount}
                            processPayment={processPayment} />
                    </div>
                </div>
            </div>
        </>
    );
}