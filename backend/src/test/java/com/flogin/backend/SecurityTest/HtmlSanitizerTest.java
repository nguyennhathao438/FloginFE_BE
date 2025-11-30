package com.flogin.backend.SecurityTest;
import com.flogin.backend.utils.HtmlSanitizer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
public class HtmlSanitizerTest {
    @Test
    @DisplayName("TC1: Loại bỏ script thành công")
    void testScriptTagRemoved() {
        String input = "<script>alert(1)</script>";
        String output = HtmlSanitizer.clean(input);
        assertEquals("<script>alert(1)</script>", output);
    }

    @Test
    @DisplayName("TC2: tag hợp lệ vẫn giữ")
    void testValidHtmlRemains() {
        String input = "<b>Hello</b>";
        String output = HtmlSanitizer.clean(input);
        assertEquals("<b>Hello</b>", output);
    }

    @Test
    @DisplayName("TC3: Loại bỏ onclick thành công")
    void testEventHandlerRemoved() {
        String input = "<div onclick='alert(1)'>Click</div>";
        String output = HtmlSanitizer.clean(input);
        assertEquals("<div>Click</div>", output);
    }

    @Test
    @DisplayName("TC4: Loại bỏ svg thành công")
    void testSvgRemoved() {
        String input = "<svg onload=alert(1)></svg>";
        String output = HtmlSanitizer.clean(input);
        assertEquals("", output);
    }

    @Test
    @DisplayName("TC5: Loại bỏ img thành công")
    void testImgOnErrorRemoved() {
        String input = "<img src=x onerror=alert(1)>";
        String output = HtmlSanitizer.clean(input);
        assertEquals("", output);
    }
}
