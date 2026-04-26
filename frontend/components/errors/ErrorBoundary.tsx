import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// SECURITY: Catches render-phase errors and shows a Spanish-language fallback UI.
// Prevents raw stack traces, component trees, or API error messages from
// being displayed to the user (OWASP A05 – Security Misconfiguration).
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    // SECURITY: Only log in dev; never expose stack traces in production
    if (__DEV__) {
      console.error('[ErrorBoundary] render error:', error.message);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
    router.replace('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Ocurrió un error inesperado</Text>
          <Text style={styles.message}>
            Algo salió mal. Por favor, volvé al inicio e intentá de nuevo.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#6B4EFF',
    paddingVertical: 13,
    paddingHorizontal: 36,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
