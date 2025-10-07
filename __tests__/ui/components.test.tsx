import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ConfirmDialog from '@/components/ConfirmDialog';

describe('UI Components', () => {
  describe('Button Component', () => {
    it('should render button with text', () => {
      const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should call onPress when clicked', () => {
      const onPress = jest.fn();
      const { getByText } = render(<Button title="Click Me" onPress={onPress} />);
      
      fireEvent.press(getByText('Click Me'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <Button title="Click Me" onPress={onPress} disabled />
      );
      
      const button = getByText('Click Me');
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should show loading state', () => {
      const { getByTestId } = render(
        <Button title="Click Me" onPress={() => {}} loading testID="button" />
      );
      
      expect(getByTestId('button')).toBeTruthy();
    });

    it('should render different variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;
      
      variants.forEach(variant => {
        const { getByText } = render(
          <Button title={`${variant} Button`} onPress={() => {}} variant={variant} />
        );
        expect(getByText(`${variant} Button`)).toBeTruthy();
      });
    });
  });

  describe('Card Component', () => {
    it('should render card with children', () => {
      const { getByText } = render(
        <Card>
          <Button title="Inside Card" onPress={() => {}} />
        </Card>
      );
      
      expect(getByText('Inside Card')).toBeTruthy();
    });

    it('should apply custom styles', () => {
      const { getByTestId } = render(
        <Card style={{ backgroundColor: 'red' }} testID="card">
          <Button title="Test" onPress={() => {}} />
        </Card>
      );
      
      expect(getByTestId('card')).toBeTruthy();
    });

    it('should render with elevated style', () => {
      const { getByTestId } = render(
        <Card elevated testID="card">
          <Button title="Test" onPress={() => {}} />
        </Card>
      );
      
      expect(getByTestId('card')).toBeTruthy();
    });
  });

  describe('ConfirmDialog Component', () => {
    it('should render dialog when visible', () => {
      const { getByText } = render(
        <ConfirmDialog
          visible={true}
          title="Confirm Action"
          message="Are you sure?"
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );
      
      expect(getByText('Confirm Action')).toBeTruthy();
      expect(getByText('Are you sure?')).toBeTruthy();
    });

    it('should not render when not visible', () => {
      const { queryByText } = render(
        <ConfirmDialog
          visible={false}
          title="Confirm Action"
          message="Are you sure?"
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );
      
      expect(queryByText('Confirm Action')).toBeNull();
    });

    it('should call onConfirm when confirm button pressed', () => {
      const onConfirm = jest.fn();
      const { getByText } = render(
        <ConfirmDialog
          visible={true}
          title="Confirm Action"
          message="Are you sure?"
          onConfirm={onConfirm}
          onCancel={() => {}}
        />
      );
      
      fireEvent.press(getByText('Confirm'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button pressed', () => {
      const onCancel = jest.fn();
      const { getByText } = render(
        <ConfirmDialog
          visible={true}
          title="Confirm Action"
          message="Are you sure?"
          onConfirm={() => {}}
          onCancel={onCancel}
        />
      );
      
      fireEvent.press(getByText('Cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should render custom button labels', () => {
      const { getByText } = render(
        <ConfirmDialog
          visible={true}
          title="Delete Item"
          message="This cannot be undone"
          confirmText="Delete"
          cancelText="Keep"
          onConfirm={() => {}}
          onCancel={() => {}}
        />
      );
      
      expect(getByText('Delete')).toBeTruthy();
      expect(getByText('Keep')).toBeTruthy();
    });
  });
});
