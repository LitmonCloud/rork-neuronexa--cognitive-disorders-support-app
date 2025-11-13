import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ConfirmDialog from '@/components/ConfirmDialog';
import { MockThemeProvider } from '../__mocks__/contextMocks';

describe('UI Components', () => {
  describe('Button Component', () => {
    it('should render button with text', () => {
      const { getByText } = render(
        <MockThemeProvider>
          <Button title="Click Me" onPress={() => {}} />
        </MockThemeProvider>
      );
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should call onPress when clicked', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <MockThemeProvider>
          <Button title="Click Me" onPress={onPress} />
        </MockThemeProvider>
      );

      fireEvent.press(getByText('Click Me'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      const onPress = jest.fn();
      const { getByText } = render(
        <MockThemeProvider>
          <Button title="Click Me" onPress={onPress} disabled />
        </MockThemeProvider>
      );

      const button = getByText('Click Me');
      fireEvent.press(button);
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should show loading state', () => {
      const { getByTestId } = render(
        <MockThemeProvider>
          <Button title="Click Me" onPress={() => {}} loading testID="button" />
        </MockThemeProvider>
      );

      expect(getByTestId('button')).toBeTruthy();
    });

    it('should render different variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;

      variants.forEach(variant => {
        const { getByText } = render(
          <MockThemeProvider>
            <Button title={`${variant} Button`} onPress={() => {}} variant={variant} />
          </MockThemeProvider>
        );
        expect(getByText(`${variant} Button`)).toBeTruthy();
      });
    });
  });

  describe('Card Component', () => {
    it('should render card with children', () => {
      const { getByText } = render(
        <MockThemeProvider>
          <Card>
            <Button title="Inside Card" onPress={() => {}} />
          </Card>
        </MockThemeProvider>
      );

      expect(getByText('Inside Card')).toBeTruthy();
    });

    it('should apply custom styles', () => {
      const { getByTestId } = render(
        <MockThemeProvider>
          <Card style={{ backgroundColor: 'red' }} testID="card">
            <Button title="Test" onPress={() => {}} />
          </Card>
        </MockThemeProvider>
      );

      expect(getByTestId('card')).toBeTruthy();
    });

    it('should render with elevated style', () => {
      const { getByTestId } = render(
        <MockThemeProvider>
          <Card elevated testID="card">
            <Button title="Test" onPress={() => {}} />
          </Card>
        </MockThemeProvider>
      );

      expect(getByTestId('card')).toBeTruthy();
    });
  });

  describe('ConfirmDialog Component', () => {
    it('should render dialog when visible', () => {
      const { getByText } = render(
        <MockThemeProvider>
          <ConfirmDialog
            visible={true}
            title="Confirm Action"
            message="Are you sure?"
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </MockThemeProvider>
      );

      expect(getByText('Confirm Action')).toBeTruthy();
      expect(getByText('Are you sure?')).toBeTruthy();
    });

    it('should not render when not visible', () => {
      const { queryByText } = render(
        <MockThemeProvider>
          <ConfirmDialog
            visible={false}
            title="Confirm Action"
            message="Are you sure?"
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </MockThemeProvider>
      );

      expect(queryByText('Confirm Action')).toBeNull();
    });

    it('should call onConfirm when confirm button pressed', () => {
      const onConfirm = jest.fn();
      const { getByText } = render(
        <MockThemeProvider>
          <ConfirmDialog
            visible={true}
            title="Confirm Action"
            message="Are you sure?"
            onConfirm={onConfirm}
            onCancel={() => {}}
          />
        </MockThemeProvider>
      );

      fireEvent.press(getByText('Confirm'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button pressed', () => {
      const onCancel = jest.fn();
      const { getByText } = render(
        <MockThemeProvider>
          <ConfirmDialog
            visible={true}
            title="Confirm Action"
            message="Are you sure?"
            onConfirm={() => {}}
            onCancel={onCancel}
          />
        </MockThemeProvider>
      );

      fireEvent.press(getByText('Cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should render custom button labels', () => {
      const { getByText } = render(
        <MockThemeProvider>
          <ConfirmDialog
            visible={true}
            title="Delete Item"
            message="This cannot be undone"
            confirmText="Delete"
            cancelText="Keep"
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </MockThemeProvider>
      );

      expect(getByText('Delete')).toBeTruthy();
      expect(getByText('Keep')).toBeTruthy();
    });
  });
});
