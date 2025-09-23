import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Transaction, TransactionItem, BusinessUnit, Outlet, Member, Employee, OperationalCost, User, ProductCategory, OperationalCostCategory, Variant, RentalResource, ResourceAvailability, Customer, CustomerCategory, Pengajuan, PengajuanItem } from '../types';

// Mock Data Generators
const generateInitialBusinessUnits = (): BusinessUnit[] => [
  { id: 1, logo: null, name: 'Kopi Kenangan', email: 'cs@kopikenangan.com', contact: '08111222333', description: 'Sebuah brand kopi kekinian di Indonesia.', website: 'https://kopikenangan.com', instagram: 'kopikenangan.id', tiktok: '@kopikenangan.id', is_active: '1' },
  { id: 2, logo: null, name: 'Penyewaan Biliar & Pesta', email: 'info@sewabiliar.com', contact: '08998887776', description: 'Penyewaan meja biliar dan perlengkapan pesta.', website: null, instagram: null, tiktok: null, is_active: '1' },
];

const generateInitialOutlets = (units: BusinessUnit[]): Outlet[] => [
  { id: 101, name: 'KK - Grand Indonesia', businessUnitId: 1 },
  { id: 102, name: 'KK - Senayan City', businessUnitId: 1 },
  { id: 201, name: 'Sewa Cepat - Jakarta Pusat', businessUnitId: 2 },
  { id: 202, name: 'Sewa Mudah - Jakarta Selatan', businessUnitId: 2 },
];

const generateInitialProducts = (): Product[] => [
  // Barang Products (price is on variant)
  { id: 'prod-1', name: 'Latte', description: 'Kopi susu klasik dengan foam lembut.', categoryId: 1, type: 'barang', imageUrl: 'https://picsum.photos/seed/latte/400', outletId: 101 },
  { id: 'prod-2', name: 'Americano', description: 'Espresso shot dengan tambahan air panas.', categoryId: 1, type: 'barang', imageUrl: 'https://picsum.photos/seed/americano/400', outletId: 101 },
  { id: 'prod-3', name: 'Thai Tea', description: 'Teh susu Thailand otentik.', categoryId: 3, type: 'barang', imageUrl: 'https://picsum.photos/seed/thaitea/400', outletId: 102 },
  // Sewa Products (price is on product)
  { id: 'prod-4', name: 'Sewa Meja Biliar', description: 'Sewa meja biliar standar internasional per jam.', categoryId: 4, generalPrice: 50000, categoryPrices: [{ categoryId: 'cust-cat-2', price: 45000 }], type: 'sewa', imageUrl: 'https://picsum.photos/seed/billiard/400', outletId: 201 },
  { id: 'prod-5', name: 'Tenda Roder', description: 'Sewa tenda roder untuk acara besar, harga per hari.', categoryId: 6, generalPrice: 1500000, categoryPrices: [{ categoryId: 'cust-cat-3', price: 1350000 }], type: 'sewa', imageUrl: 'https://picsum.photos/seed/tent/400', outletId: 202 },
];

const generateInitialVariants = (): Variant[] => [
    // Variants for Latte (prod-1)
    { id: 'var-1', productId: 'prod-1', name: 'Panas', sku: 'LAT-HOT', generalPrice: 35000, categoryPrices: [{ categoryId: 'cust-cat-2', price: 32000 }], stock: 50 },
    { id: 'var-2', productId: 'prod-1', name: 'Dingin', sku: 'LAT-ICE', generalPrice: 38000, categoryPrices: [{ categoryId: 'cust-cat-2', price: 35000 }], stock: 80 },
    // Variants for Americano (prod-2)
    { id: 'var-3', productId: 'prod-2', name: 'Panas', sku: 'AME-HOT', generalPrice: 30000, categoryPrices: [], stock: 60 },
    // Variants for Thai Tea (prod-3)
    { id: 'var-5', productId: 'prod-3', name: 'Original', sku: 'THA-ORI', generalPrice: 25000, categoryPrices: [{ categoryId: 'cust-cat-3', price: 22000 }], stock: 120 },
    { id: 'var-6', productId: 'prod-3', name: 'Dengan Boba', sku: 'THA-BOBA', generalPrice: 28000, categoryPrices: [{ categoryId: 'cust-cat-3', price: 25000 }], stock: 5 }, // Low stock example
];

const generateInitialRentalResources = (): RentalResource[] => [
    { id: 'res-1', productId: 'prod-4', name: 'Meja 1', code: 'MB-01' },
    { id: 'res-2', productId: 'prod-4', name: 'Meja 2', code: 'MB-02' },
];

const generateInitialResourceAvailabilities = (): ResourceAvailability[] => [
    { id: 'avail-1', resourceId: 'res-1', dayOfWeek: 'Senin', startTime: '10:00', endTime: '22:00' },
    { id: 'avail-2', resourceId: 'res-1', dayOfWeek: 'Selasa', startTime: '10:00', endTime: '22:00' },
];

const generateInitialCustomerCategories = (): CustomerCategory[] => [ { id: 'cust-cat-1', name: 'Umum' }, { id: 'cust-cat-2', name: 'VIP' }, { id: 'cust-cat-3', name: 'Reseller' } ];
const generateInitialCustomers = (businessUnits: BusinessUnit[], categories: CustomerCategory[]): Customer[] => [ { id: 'cust-1', name: 'Rina Marlina', phone_number: '081234567890', categoryId: 'cust-cat-1', businessUnitId: 1 }, { id: 'cust-2', name: 'Joko Widodo', phone_number: '081298765432', categoryId: 'cust-cat-2', businessUnitId: 1 } ];

const generateInitialTransactions = (products: Product[], variants: Variant[], outlets: Outlet[], customers: Customer[]): Transaction[] => {
    const transactions: Transaction[] = [];
    if (products.length === 0 || outlets.length === 0) return [];
    for (let i = 0; i < 5; i++) {
        const product = products[0];
        const variant = variants[0];
        transactions.push({
            id: `trans-${Date.now()}-${i}`,
            items: [{ productId: product.id, productName: product.name, variantName: variant.name, quantity: 1, priceAtTransaction: variant.generalPrice }],
            total: variant.generalPrice,
            date: new Date(),
            outletId: outlets[0].id,
            status: 'Selesai',
            paymentMethod: 'Tunai',
            customerId: customers[0].id,
        });
    }
    return transactions;
};

const generateInitialMembers = (): Member[] => [];
const generateInitialEmployees = (outlets: Outlet[]): Employee[] => [];
const generateInitialOperationalCostCategories = (): OperationalCostCategory[] => [];
const generateInitialOperationalCosts = (outlets: Outlet[], categories: OperationalCostCategory[]): OperationalCost[] => [];
const generateInitialUsers = (): User[] => [ { id: 'user-1', username: 'admin', password: 'admin', role: 'Admin' } ];


function useAsyncStorageState<T>(key: string, generator: () => T): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(generator());

    // Effect to load state from AsyncStorage on component mount
    useEffect(() => {
        const loadState = async () => {
            try {
                const savedItem = await AsyncStorage.getItem(key);
                if (savedItem) {
                    const parsed = JSON.parse(savedItem);
                    // Re-hydrate Date objects if necessary
                    if (key.includes('transactions') || key.includes('members') || key.includes('operationalCosts')) {
                        const dateParsed = parsed.map((item: any) => ({
                            ...item,
                            date: item.date ? new Date(item.date) : undefined,
                            joinDate: item.joinDate ? new Date(item.joinDate) : undefined,
                        }));
                        setState(dateParsed);
                    } else {
                        setState(parsed);
                    }
                }
            } catch (error) {
                console.error(`Error reading from AsyncStorage key "${key}":`, error);
            }
        };
        loadState();
    }, [key]);

    // Effect to save state to AsyncStorage whenever it changes
    useEffect(() => {
        const saveState = async () => {
            try {
                await AsyncStorage.setItem(key, JSON.stringify(state));
            } catch (error) {
                console.error(`Error writing to AsyncStorage key "${key}":`, error);
            }
        };
        saveState();
    }, [key, state]);

    return [state, setState];
}

const usePosData = () => {
    const [businessUnits, setBusinessUnits] = useAsyncStorageState('pos-businessUnits', generateInitialBusinessUnits);
    const [outlets, setOutlets] = useAsyncStorageState('pos-outlets', () => generateInitialOutlets(businessUnits));
    const [products, setProducts] = useAsyncStorageState('pos-products', generateInitialProducts);
    const [variants, setVariants] = useAsyncStorageState('pos-variants', generateInitialVariants);
    const [rentalResources, setRentalResources] = useAsyncStorageState('pos-rentalResources', generateInitialRentalResources);
    const [resourceAvailabilities, setResourceAvailabilities] = useAsyncStorageState('pos-resourceAvailabilities', generateInitialResourceAvailabilities);
    const [members, setMembers] = useAsyncStorageState('pos-members', generateInitialMembers);
    const [employees, setEmployees] = useAsyncStorageState('pos-employees', () => generateInitialEmployees(outlets));
    const [operationalCostCategories, setOperationalCostCategories] = useAsyncStorageState('pos-operationalCostCategories', generateInitialOperationalCostCategories);
    const [operationalCosts, setOperationalCosts] = useAsyncStorageState('pos-operationalCosts', () => generateInitialOperationalCosts(outlets, operationalCostCategories));
    const [users, setUsers] = useAsyncStorageState('pos-users', generateInitialUsers);
    const [customerCategories, setCustomerCategories] = useAsyncStorageState('pos-customerCategories', generateInitialCustomerCategories);
    const [customers, setCustomers] = useAsyncStorageState('pos-customers', () => generateInitialCustomers(businessUnits, customerCategories));
    const [transactions, setTransactions] = useAsyncStorageState('pos-transactions', () => generateInitialTransactions(products, variants, outlets, customers));
    
    // Categories from API
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const refetchCategories = useCallback(async () => {
        // This logic remains the same as it's a network request
    }, [businessUnits]);

    useEffect(() => {
        refetchCategories();
    }, [refetchCategories]);

    // All CRUD functions
    const addBusinessUnit = (unit: Omit<BusinessUnit, 'id'>) => setBusinessUnits(prev => [...prev, { ...unit, id: Date.now() }]);
    const updateBusinessUnit = (updatedUnit: BusinessUnit) => setBusinessUnits(prev => prev.map(u => u.id === updatedUnit.id ? updatedUnit : u));
    const deleteBusinessUnit = (unitId: number) => setBusinessUnits(prev => prev.filter(u => u.id !== unitId));
    
    const addOutlet = (outlet: Omit<Outlet, 'id'>) => setOutlets(prev => [...prev, { ...outlet, id: Date.now() }]);
    const updateOutlet = (updatedOutlet: Outlet) => setOutlets(prev => prev.map(o => o.id === updatedOutlet.id ? updatedOutlet : o));
    const deleteOutlet = (outletId: number) => setOutlets(prev => prev.filter(o => o.id !== outletId));

    const addProduct = (product: Omit<Product, 'id'>) => setProducts(prev => [...prev, { ...product, id: `prod-${Date.now()}` }]);
    const updateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    const deleteProduct = (productId: string) => setProducts(prev => prev.filter(p => p.id !== productId));

    const addCustomer = (customer: Omit<Customer, 'id'>) => setCustomers(prev => [...prev, { ...customer, id: `cust-${Date.now()}` }]);
    const updateCustomer = (updatedCustomer: Customer) => setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    const deleteCustomer = (customerId: string) => setCustomers(prev => prev.filter(c => c.id !== customerId));

    return { 
        businessUnits, outlets, products, transactions, members, employees, operationalCostCategories, operationalCosts, users, categories, 
        variants, rentalResources, resourceAvailabilities,
        customerCategories, customers,
        refetchCategories,
        addBusinessUnit, updateBusinessUnit, deleteBusinessUnit,
        addOutlet, updateOutlet, deleteOutlet,
        addProduct, updateProduct, deleteProduct,
        addCustomer, updateCustomer, deleteCustomer,
    };
};

export default usePosData;
