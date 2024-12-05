import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "../../ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox"; // assuming Checkbox component exists
import { Select, SelectContent, SelectTrigger, SelectValue, SelectGroup, SelectItem } from "@/components/ui/select";

function CreateForm() {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm();
  
  // Mocked auth user
  const authUser = {
    _id: { "$oid": "6751f796037e1e2b564fd0bd" },
    fullName: "head01",
    email: "vishhhhhh03@gmail.com",
    branch: "unknown",
    department: "unknown",
    role: "Head",
  };

  const categories = {
    "Administrative": ["Institutional Policies", "Employment Records", "Salary Records", "Annual Reports", "Government Correspondence"],
    "CSE": ["Curriculum_Syllabus", "Faculty_Records", "Course_Materials", "Lab_Records", "Student_Records", "Research_Projects", "Exam_Results"],
    "ECE": ["Curriculum_Syllabus", "Faculty_Records", "Course_Materials", "Lab_Records", "Student_Records", "Research_Projects", "Exam_Results"],
    "ME": ["Curriculum_Syllabus", "Faculty_Records", "Course_Materials", "Lab_Records", "Student_Records", "Research_Projects", "Exam_Results"],
    "CE": ["Curriculum_Syllabus", "Faculty_Records", "Course_Materials", "Lab_Records", "Student_Records", "Research_Projects", "Exam_Results"],
    "Fees_Finance": ["Fee_Structure", "Fee_Collection_Records", "Financial_Reports", "Scholarship_Records"],
    "Hostel": ["Allotment_Records", "Maintenance_Logs", "Fee_Records"],
    "IT_Systems": ["Software_Licenses", "Network_Configuration", "Security_Reports"],
    "Events": ["Event_Approvals", "Cultural_Activities"],
  };

  const [role, setRole] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const onSubmit = async (data) => {
    console.log(data)
    setLoading(true);
    setError(null);
    // Handle form submission logic
  };

  const password = watch("password");

  return (
    <div className="flex justify-center items-center min-h-screen b">
      <Card className="w-full max-w-4xl p-8 space-y-6 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold text-center mb-6">
          {authUser.role === "Head" ? "Head Admin Panel" : "Admin Panel"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <Label htmlFor="role">Select the role</Label>
                <Select onValueChange={(value) => { setRole(value); setValue("role", value); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {authUser.role === "Head" ? (
                        <>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </>
                      ) : (
                        <SelectItem value="staff">Staff</SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500">Role is required</p>}
              </div>

              {/* Branch Selection */}
              <div>
                <Label htmlFor="branch">Select the Branch</Label>
                <Select onValueChange={(value) => { setBranch(value); setValue("branch", value); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.keys(categories).map((key, index) => (
                        <SelectItem key={index} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.branch && <p className="text-red-500">Branch is required</p>}
              </div>

              {/* Department Access Selection */}
              <div>
                <Label htmlFor="departments">Select Departments</Label>
                <div className="space-y-2">
                  {/* Display departments based on the selected branch */}
                  {branch && categories[branch] && (
                    <div>
                      <Controller
                        name={`departments.${branch}`}
                        control={control}
                        render={({ field }) => (
                          <div className="border rounded-md p-4 mt-2" >
                            <div className="grid grid-cols-2 gap-4">

                           
                            {categories[branch].map((department, idx) => (
                              <div className="flex items-center space-x-2">
                              <p>
                                  {department}
                              </p>
                              <Checkbox key={idx} {...field} value={department} label={department} />
                              </div>
                            ))}
                          </div>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
                {errors.departments && <p className="text-red-500">Please select departments</p>}
              </div>

              {/* Name Input */}
              <div>
                <Label htmlFor="name">Enter the full name</Label>
                <Input id="name" type="text" {...register("name", { required: "Name is required" })} className="w-full" />
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              {/* User ID */}
              <div>
                <Label htmlFor="userId">Enter User ID</Label>
                <Input id="userId" type="text" {...register("userId", { required: "User ID is required" })} className="w-full" />
                {errors.userId && <p className="text-red-500">{errors.userId.message}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Enter Email</Label>
                <Input id="email" type="email" {...register("email", { required: "Email is required" })} className="w-full" />
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber">Enter Phone Number</Label>
                <Input id="phoneNumber" type="tel" {...register("phoneNumber", { required: "Phone number is required" })} className="w-full" />
                {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Set Password</Label>
                <Input id="password" type="password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long" } })} className="w-full" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword", { required: "Please confirm your password", validate: (value) => value === password || "Passwords do not match" })} className="w-full" />
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit"}
          </Button>

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </Card>
    </div>
  );
}

export default CreateForm;
