package com.example.nadifit.helper;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;

public class PasswordGenerator {
	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    public static List<String> generatePasswords(int numberOfPasswords, int length) {
        SecureRandom random = new SecureRandom();
        List<String> passwords = new ArrayList<>();

        for (int j = 0; j < numberOfPasswords; j++) {
            StringBuilder password = new StringBuilder();
            for (int i = 0; i < length; i++) {
                int index = random.nextInt(CHARACTERS.length());
                password.append(CHARACTERS.charAt(index));
            }
            passwords.add(password.toString());
        }

        return passwords;
    }
}
