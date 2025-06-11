import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <EmptyState
          iconName="MapPin"
          title="404"
          message="Looks like you've wandered off the neighborhood map. Let's get you back to discovering skills!"
          actionText="Back to Browse"
          onActionClick={() => navigate('/')}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="MapPin" className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          </motion.div>
          <h1 className="text-4xl font-heading text-gray-900 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Looks like you've wandered off the neighborhood map. Let's get you back to discovering skills!
          </p>
          <Button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:brightness-110 transition-all"
          >
            Back to Browse
          </Button>
        </EmptyState>
      </motion.div>
    </div>
  );
}