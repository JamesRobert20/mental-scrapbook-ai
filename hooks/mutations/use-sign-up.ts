import { useMutation } from '@tanstack/react-query';

import { signUp } from '@/lib/services/auth.service';
import { setAuthAuthenticated } from '@/stores/auth.store';
import type { SignUpInput } from '@/lib/z/auth';

export function useSignUp() {
  return useMutation({
    mutationFn: (input: SignUpInput) => signUp(input),
    onSuccess: ({ user }) => {
      setAuthAuthenticated(user);
    },
  });
}
