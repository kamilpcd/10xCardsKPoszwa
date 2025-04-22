import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Wprowadź poprawny adres email";
    }

    if (!password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (password.length < 8) {
      newErrors.password = "Hasło musi mieć co najmniej 8 znaków";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Hasła nie są identyczne";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Tutaj będzie integracja z backendem
      console.log("Rejestracja z danymi:", { email, password, confirmPassword });

      // Symulacja opóźnienia - do usunięcia przy faktycznej integracji
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Przykładowa obsługa błędu - do zastąpienia faktyczną integracją
      setErrors({
        general: "To jest przykładowy komunikat błędu. Zostanie zastąpiony integracją z backendem.",
      });
    } catch (error) {
      setErrors({
        general: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Utwórz konto</CardTitle>
      </CardHeader>
      <CardContent>
        {errors.general && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="twoj@email.pl"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 znaków"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!errors.password}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Powtórz hasło</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Powtórz hasło"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Rejestracja..." : "Zarejestruj się"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
