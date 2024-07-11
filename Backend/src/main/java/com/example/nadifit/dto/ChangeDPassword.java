package com.example.nadifit.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

public class ChangeDPassword {
	
	@NotEmpty(message = "*This is Mandatory")
	@Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$", message = "*Should Match Pattern")
    private String newPassword;
    private String retypedPassword;
    private String targetEmail;
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	public String getRetypedPassword() {
		return retypedPassword;
	}
	public void setRetypedPassword(String retypedPassword) {
		this.retypedPassword = retypedPassword;
	}
	public String getTargetEmail() {
		return targetEmail;
	}
	public void setTargetEmail(String targetEmail) {
		this.targetEmail = targetEmail;
	}
}
