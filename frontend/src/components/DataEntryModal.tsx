import React, { useState } from 'react';
import { X, Save, Calendar, Users, ShoppingBag, Plus, ClipboardList, Trash2, DollarSign, UtensilsCrossed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'sales' | 'inventory';

interface DishSale {
    name: string;
    quantity: string;
}

import { supabase } from '../lib/supabase';

const DataEntryModal: React.FC<DataEntryModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('sales');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sales State
    const [salesData, setSalesData] = useState({
        date: new Date().toISOString().split('T')[0],
        customers: '',
        totalSales: '',
        isFestival: false,
        occasionName: '',
        notes: '',
        dishesSold: [{ name: '', quantity: '' }] as DishSale[]
    });

    // Inventory State
    const [inventoryData, setInventoryData] = useState({
        date: new Date().toISOString().split('T')[0],
        itemName: '',
        qtyBought: '',
        purchasePrice: '',
        expiryDate: '',
        qtyWasted: '',
        wasteReason: ''
    });

    const handleSalesSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('sales_logs')
                .insert([{
                    date: salesData.date,
                    customers: parseInt(salesData.customers),
                    total_revenue: parseFloat(salesData.totalSales),
                    dishes_sold: salesData.dishesSold
                }]);

            if (error) throw error;
            alert('Sales report saved to Supabase!');
            onClose();
        } catch (err) {
            console.error('Error saving sales:', err);
            alert('Failed to save sales report.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInventorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('inventory')
                .insert([{
                    name: inventoryData.itemName,
                    quantity: inventoryData.qtyBought,
                    price_per_unit: inventoryData.purchasePrice,
                    expiry_date: inventoryData.expiryDate,
                    status: 'In Stock'
                }]);

            if (error) throw error;
            alert('Inventory updated in Supabase!');
            onClose();
        } catch (err) {
            console.error('Error saving inventory:', err);
            alert('Failed to update inventory.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addDishField = () => {
        setSalesData({
            ...salesData,
            dishesSold: [...salesData.dishesSold, { name: '', quantity: '' }]
        });
    };

    const removeDishField = (index: number) => {
        const newList = [...salesData.dishesSold];
        newList.splice(index, 1);
        setSalesData({ ...salesData, dishesSold: newList });
    };

    const updateDishField = (index: number, field: keyof DishSale, value: string) => {
        const newList = [...salesData.dishesSold];
        newList[index][field] = value;
        setSalesData({ ...salesData, dishesSold: newList });
    };

    const inputStyle = {
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius)',
        background: 'var(--input-bg)',
        border: '1px solid var(--glass-border-subtle)',
        color: 'hsl(var(--foreground))',
        outline: 'none',
        width: '100%',
        transition: 'all 0.2s ease'
    };

    const labelStyle = {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'hsl(var(--foreground))',
        opacity: 0.8,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.25rem'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '2rem 1rem',
                    overflowY: 'auto'
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="glass"
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            padding: '2rem',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            zIndex: 2001,
                            marginBottom: '2rem'
                        }}
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Record Activity</h2>
                                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', fontWeight: 500 }}>Track performance and inventory logs</p>
                            </div>
                            <button onClick={onClose} style={{
                                background: 'var(--glass-bg-subtle)',
                                border: '1px solid var(--glass-border-subtle)',
                                color: 'hsl(var(--foreground))',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: 'flex',
                            background: 'var(--glass-bg-subtle)',
                            padding: '0.3rem',
                            borderRadius: '14px',
                            marginBottom: '2rem',
                            border: '1px solid var(--glass-border-subtle)'
                        }}>
                            {(['sales', 'inventory'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: 'calc(var(--radius) - 4px)',
                                        border: 'none',
                                        background: activeTab === tab ? 'hsl(var(--primary))' : 'transparent',
                                        color: activeTab === tab ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {tab === 'sales' ? 'Daily Sales' : 'Inventory Logs'}
                                </button>
                            ))}
                        </div>

                        {/* Sales Form */}
                        {activeTab === 'sales' && (
                            <form onSubmit={handleSalesSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}><Calendar size={14} /> Date</label>
                                        <input
                                            type="date"
                                            value={salesData.date}
                                            onChange={(e) => setSalesData({ ...salesData, date: e.target.value })}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><Users size={14} /> Total Customers</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 150"
                                            value={salesData.customers}
                                            onChange={(e) => setSalesData({ ...salesData, customers: e.target.value })}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1.25rem',
                                    borderRadius: 'var(--radius)',
                                    background: 'hsla(var(--primary), 0.05)',
                                    border: '1px solid hsla(var(--primary), 0.1)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: salesData.isFestival ? '1rem' : '0' }}>
                                        <input
                                            type="checkbox"
                                            id="isFestival"
                                            checked={salesData.isFestival}
                                            onChange={(e) => setSalesData({ ...salesData, isFestival: e.target.checked })}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'hsl(var(--primary))' }}
                                        />
                                        <label htmlFor="isFestival" style={{ fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', color: 'hsl(var(--foreground))' }}>Special Occasion / Festival Day</label>
                                    </div>

                                    {salesData.isFestival && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <label style={{ ...labelStyle, fontSize: '0.75rem' }}>What is the occasion?</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Holi, Diwali, Weekend Surge"
                                                value={salesData.occasionName}
                                                onChange={(e) => setSalesData({ ...salesData, occasionName: e.target.value })}
                                                style={{ ...inputStyle, background: 'rgba(255, 255, 255, 0.1)' }}
                                                required={salesData.isFestival}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Dish-wise Sales */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <label style={{ ...labelStyle, marginBottom: 0 }}><UtensilsCrossed size={14} /> Dish-wise Sales</label>
                                        <button
                                            type="button"
                                            onClick={addDishField}
                                            style={{
                                                background: 'hsl(var(--primary))',
                                                color: 'hsl(var(--primary-foreground))',
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem'
                                            }}
                                        >
                                            <Plus size={12} /> Add Dish
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {salesData.dishesSold.map((dish, index) => (
                                            <div key={index} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr) auto', gap: '0.75rem', alignItems: 'end' }}>
                                                <div>
                                                    {index === 0 && <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>Dish Name</span>}
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Biryani"
                                                        value={dish.name}
                                                        onChange={(e) => updateDishField(index, 'name', e.target.value)}
                                                        style={{ ...inputStyle, padding: '0.5rem 0.75rem' }}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    {index === 0 && <span style={{ fontSize: '0.7rem', color: 'hsl(var(--muted-foreground))' }}>Qty Sold</span>}
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        value={dish.quantity}
                                                        onChange={(e) => updateDishField(index, 'quantity', e.target.value)}
                                                        style={{ ...inputStyle, padding: '0.5rem 0.75rem' }}
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeDishField(index)}
                                                    disabled={salesData.dishesSold.length === 1}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#ef4444',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '0.5rem',
                                                        cursor: salesData.dishesSold.length === 1 ? 'not-allowed' : 'pointer',
                                                        opacity: salesData.dishesSold.length === 1 ? 0.5 : 1
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle}><ShoppingBag size={14} /> Total Revenue (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 4500"
                                        value={salesData.totalSales}
                                        onChange={(e) => setSalesData({ ...salesData, totalSales: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex-center"
                                    disabled={isSubmitting}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius)',
                                        background: isSubmitting ? 'rgba(255, 255, 255, 0.1)' : 'hsl(var(--primary))',
                                        color: isSubmitting ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary-foreground))',
                                        border: 'none',
                                        fontWeight: 700,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        gap: '0.5rem',
                                        marginTop: '1rem',
                                        width: '100%'
                                    }}
                                >
                                    <Save size={20} />
                                    {isSubmitting ? 'Saving...' : 'Save Daily Report'}
                                </button>
                            </form>
                        )}

                        {/* Inventory Form */}
                        {activeTab === 'inventory' && (
                            <form onSubmit={handleInventorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}><Calendar size={14} /> Log Date</label>
                                    <input
                                        type="date"
                                        value={inventoryData.date}
                                        onChange={(e) => setInventoryData({ ...inventoryData, date: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}><ClipboardList size={14} /> Item Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Basmati Rice, Chicken, etc."
                                        value={inventoryData.itemName}
                                        onChange={(e) => setInventoryData({ ...inventoryData, itemName: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}><Calendar size={14} /> Expiry Date</label>
                                    <input
                                        type="date"
                                        value={inventoryData.expiryDate}
                                        onChange={(e) => setInventoryData({ ...inventoryData, expiryDate: e.target.value })}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}><Plus size={14} /> Qty Bought (kg/unit)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 50"
                                            value={inventoryData.qtyBought}
                                            onChange={(e) => setInventoryData({ ...inventoryData, qtyBought: e.target.value })}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}><DollarSign size={14} /> Price per Unit (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={inventoryData.purchasePrice}
                                            onChange={(e) => setInventoryData({ ...inventoryData, purchasePrice: e.target.value })}
                                            style={inputStyle}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={labelStyle}><Trash2 size={14} /> Qty Wasted (kg/unit)</label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 2"
                                            value={inventoryData.qtyWasted}
                                            onChange={(e) => setInventoryData({ ...inventoryData, qtyWasted: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Reason for Waste</label>
                                        <select
                                            value={inventoryData.wasteReason}
                                            onChange={(e) => setInventoryData({ ...inventoryData, wasteReason: e.target.value })}
                                            style={{ ...inputStyle, appearance: 'none', background: 'var(--input-bg)' }}
                                            className="glass-card"
                                        >
                                            <option value="" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>Select reason</option>
                                            <option value="expired" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>Expired</option>
                                            <option value="damaged" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>Damaged</option>
                                            <option value="overcooked" style={{ background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>Overcooked</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="flex-center"
                                    disabled={isSubmitting}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: 'var(--radius)',
                                        background: isSubmitting ? 'rgba(255, 255, 255, 0.1)' : 'hsl(var(--primary))',
                                        color: isSubmitting ? 'hsl(var(--muted-foreground))' : 'hsl(var(--primary-foreground))',
                                        border: 'none',
                                        fontWeight: 700,
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        gap: '0.5rem',
                                        marginTop: '1rem',
                                        width: '100%'
                                    }}
                                >
                                    <Save size={20} />
                                    {isSubmitting ? 'Updating...' : 'Update Inventory'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DataEntryModal;
