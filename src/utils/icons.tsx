import React from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  Shirt,
  Receipt,
  GraduationCap,
  HeartPulse,
  Film,
  Home,
  CircleEllipsis,
  Briefcase,
  Laptop,
  TrendingUp,
  Building2,
  Gift,
  Key,
  Coins,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  Building,
  HelpCircle,
} from 'lucide-react';
import { PaymentMethod } from '../types';

export const getCategoryIcon = (iconName: string, className = 'w-5 h-5'): React.ReactNode => {
  switch (iconName) {
    case 'UtensilsCrossed': return <UtensilsCrossed className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Receipt': return <Receipt className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'Film': return <Film className={className} />;
    case 'Home': return <Home className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Gift': return <Gift className={className} />;
    case 'Key': return <Key className={className} />;
    case 'Coins': return <Coins className={className} />;
    case 'CircleEllipsis': return <CircleEllipsis className={className} />;
    default: return <CircleEllipsis className={className} />;
  }
};

export const getPaymentMethodInfo = (method: PaymentMethod): { label: string; icon: React.ReactNode } => {
  switch (method) {
    case 'cash':
      return { label: 'Cash', icon: <Banknote className="w-4 h-4 text-emerald-600" /> };
    case 'credit_card':
      return { label: 'Credit Card', icon: <CreditCard className="w-4 h-4 text-blue-600" /> };
    case 'debit_card':
      return { label: 'Debit Card', icon: <CreditCard className="w-4 h-4 text-indigo-600" /> };
    case 'bank_transfer':
      return { label: 'Bank Transfer', icon: <Building className="w-4 h-4 text-purple-600" /> };
    case 'upi':
      return { label: 'UPI / Instant Pay', icon: <Smartphone className="w-4 h-4 text-amber-600" /> };
    case 'mobile_wallet':
      return { label: 'Mobile Wallet', icon: <Wallet className="w-4 h-4 text-teal-600" /> };
    case 'crypto':
      return { label: 'Crypto', icon: <Coins className="w-4 h-4 text-yellow-600" /> };
    default:
      return { label: 'Other', icon: <HelpCircle className="w-4 h-4 text-slate-500" /> };
  }
};
