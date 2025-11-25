package com.flogin.backend.utils;

import com.flogin.backend.entity.Category;
import com.nimbusds.jose.Payload;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Arrays;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CategoryValid.CategoryValidator.class)
public @interface CategoryValid {
    String message() default "Danh mục không hợp lệ";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
    class CategoryValidator implements ConstraintValidator<CategoryValid, Category> {

        @Override
        public boolean isValid(Category value, ConstraintValidatorContext context) {
            if (value == null) return false;
            return Arrays.stream(Category.values())
                    .anyMatch(c -> c == value);
        }
    }
}
