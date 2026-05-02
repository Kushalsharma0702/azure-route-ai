import React from 'react'
import { motion, MotionProps } from 'framer-motion'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  delay?: number
  hover?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  delay = 0, 
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      className={`
        backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl 
        shadow-xl p-6 hover:bg-white/15 transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const GradientBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export const AnimatedButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  icon?: React.ReactNode
}> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  disabled = false,
  icon
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-2xl',
    secondary: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30',
    ghost: 'text-white hover:bg-white/10'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-xl font-semibold transition-all duration-300
        flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </motion.button>
  )
}

export const AIChatBubble: React.FC<{
  message: string
  sender: 'user' | 'ai'
  delay?: number
}> = ({ message, sender, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: sender === 'user' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`
        max-w-xs px-4 py-3 rounded-2xl backdrop-blur-md
        ${sender === 'user' 
          ? 'bg-blue-600/80 text-white rounded-br-none' 
          : 'bg-white/20 text-gray-800 border border-white/30 rounded-bl-none'
        }
      `}>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  )
}

export const MetricCard: React.FC<{
  icon: string
  label: string
  value: string | number
  change?: number
  color?: 'green' | 'yellow' | 'red' | 'blue'
  delay?: number
}> = ({ icon, label, value, change, color = 'blue', delay = 0 }) => {
  const colorMap = {
    green: 'bg-green-500/20 text-green-600 border-green-200/30',
    yellow: 'bg-yellow-500/20 text-yellow-600 border-yellow-200/30',
    red: 'bg-red-500/20 text-red-600 border-red-200/30',
    blue: 'bg-blue-500/20 text-blue-600 border-blue-200/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={`
        backdrop-blur-xl rounded-2xl p-6 border
        ${colorMap[color]}
      `}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-sm font-medium opacity-70">{label}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {change && (
        <div className={`text-xs mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
    </motion.div>
  )
}

export const ImageCard: React.FC<{
  image: string
  title: string
  description: string
  tags?: string[]
  delay?: number
}> = ({ image, title, description, tags = [], delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8 }}
      className="relative group overflow-hidden rounded-3xl h-96 cursor-pointer"
    >
      <img 
        src={image} 
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
      />
      
      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileHover={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex flex-col justify-end p-6 text-white"
      >
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-200 mb-4">{description}</p>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              className="bg-blue-500/80 backdrop-blur px-3 py-1 rounded-full text-xs"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export const LiveIndicator: React.FC = () => {
  return (
    <motion.div className="flex items-center gap-2">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-3 h-3 bg-red-500 rounded-full"
      />
      <span className="text-sm font-semibold text-red-500">LIVE</span>
    </motion.div>
  )
}

export const typingAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

export const typingVariant = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 },
  },
}
