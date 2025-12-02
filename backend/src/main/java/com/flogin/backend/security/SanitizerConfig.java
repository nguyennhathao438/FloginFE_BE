package com.flogin.backend.security;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

import com.flogin.backend.utils.HtmlSanitizer;

public class SanitizerConfig extends JsonDeserializer<String> {
    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        String decoded = URLDecoder.decode(value, StandardCharsets.UTF_8);
        return HtmlSanitizer.clean(decoded);
    }
}
