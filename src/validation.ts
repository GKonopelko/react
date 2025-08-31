export const isStrongPassword = (password: string): boolean => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const validateFile = (file: File): string | null => {
  if (file.size > 5 * 1024 * 1024) {
    return 'File too big (max. 5MB)';
  }

  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    return 'Unsupported file format';
  }

  return null;
};
