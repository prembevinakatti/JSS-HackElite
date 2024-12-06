import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/Axiosinstance";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "@/redux/authslice";
import { useDispatch } from "react-redux";
function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "http://localhost:3000/api/user/loginAccount",
        data
      );
      toast.success("Login successful");
      const userdata = response.data.user;
      console.log(userdata);
      dispatch(setAuthUser(userdata));
      if (userdata.metamaskId == null) {
        navigate("/connectmetamask");
      } else {
        navigate(`${userdata.role}/home`);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <Card className="w-[400px] p-4">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Please enter your details below</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="flex gap-2 flex-col">
              <Label htmlFor="email">Your email address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="flex gap-2 flex-col mt-4">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <Button type="submit" className="mt-6 w-full" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </CardContent>
          <Separator className="my-4" />
          <CardFooter></CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;
