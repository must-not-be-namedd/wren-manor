import { useState } from 'react';
import { motion } from 'framer-motion';
import { ManorButton } from './manor-button';
import { ManorCard, ManorCardContent, ManorCardHeader, ManorCardTitle } from './manor-card';
import { Phone, Delete, Check } from 'lucide-react';

interface PhoneKeypadProps {
  onComplete: (pin: string) => void;
  maxLength?: number;
  title?: string;
  description?: string;
}

export const PhoneKeypad = ({ 
  onComplete, 
  maxLength = 4, 
  title = "Enter PIN",
  description = "Use the keypad to enter the 4-digit code"
}: PhoneKeypadProps) => {
  const [pin, setPin] = useState('');

  const handleNumberClick = (number: string) => {
    if (pin.length < maxLength) {
      setPin(prev => prev + number);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === maxLength) {
      onComplete(pin);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <ManorCard className="w-80 mx-auto">
      <ManorCardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Phone className="h-8 w-8 text-primary" />
        </div>
        <ManorCardTitle className="text-lg">{title}</ManorCardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </ManorCardHeader>
      
      <ManorCardContent className="space-y-4">
        {/* PIN Display */}
        <div className="flex justify-center space-x-2 mb-6">
          {Array.from({ length: maxLength }, (_, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 border-2 border-primary/30 rounded-lg flex items-center justify-center text-lg font-mono"
              animate={{
                borderColor: i < pin.length ? 'rgb(var(--primary))' : 'rgba(var(--primary), 0.3)',
                backgroundColor: i < pin.length ? 'rgba(var(--primary), 0.1)' : 'transparent'
              }}
            >
              {i < pin.length ? '•' : ''}
            </motion.div>
          ))}
        </div>

        {/* Keypad */}
        <div className="space-y-2">
          {numbers.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-2">
              {row.map((number) => (
                <motion.div key={number}>
                  <ManorButton
                    variant="outline"
                    size="lg"
                    className="w-16 h-16 text-lg font-mono"
                    onClick={() => handleNumberClick(number)}
                    disabled={pin.length >= maxLength && !['*', '#'].includes(number)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {number}
                  </ManorButton>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-2 pt-4">
          <ManorButton
            variant="outline"
            size="lg"
            onClick={handleDelete}
            disabled={pin.length === 0}
            className="w-16 h-12"
          >
            <Delete className="h-4 w-4" />
          </ManorButton>
          
          <ManorButton
            variant="outline"
            size="lg"
            onClick={handleClear}
            disabled={pin.length === 0}
            className="w-16 h-12"
          >
            Clear
          </ManorButton>
          
          <ManorButton
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={pin.length !== maxLength}
            className="w-16 h-12"
          >
            <Check className="h-4 w-4" />
          </ManorButton>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground">
          {pin.length === 0 && "Enter your PIN"}
          {pin.length > 0 && pin.length < maxLength && `${pin.length}/${maxLength} digits entered`}
          {pin.length === maxLength && "Ready to submit"}
        </div>
      </ManorCardContent>
    </ManorCard>
  );
};
