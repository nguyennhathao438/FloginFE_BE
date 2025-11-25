package com.flogin.backend.utils;

import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

public class HtmlSanitizer {

    // Kết hợp Sanitizers cơ bản: FORMATTING + LINK + STYLES + BLOCKS
    private static final PolicyFactory POLICY = Sanitizers.FORMATTING
            .and(Sanitizers.LINKS)
            .and(Sanitizers.BLOCKS);

    public static String clean(String input) {
        if (input == null) return null;
        return POLICY.sanitize(input);
    }
}
