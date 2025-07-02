'use server'

import { auth, signIn, signOut } from "@/auth";
import { IUserName, IUserSignIn, IUSignUp } from "@/types";
import { redirect } from "next/navigation";
import { UserSignUpSchema } from "../validator";
import { connectToDatabase } from "../db";
import User from "../db/models/user.model";
import bcrypt from "bcryptjs";
import { formatError } from "../utils";

import { revalidatePath } from "next/cache";


export async function signInWithCredentials(user:IUserSignIn) {
     return await signIn('credentials', {...user, redirect: false})
}

export const SignOut = async () => {
     const redirectTo = await signOut({ redirect: false })
     redirect(redirectTo.redirect)
}

export const signInWithGoogle = async () => {
     await signIn('google')
}

//CREATE

export async function registerUser(userSignUp: IUSignUp) {
     try {
          const user = await UserSignUpSchema.parseAsync({
               name: userSignUp.name,
               email: userSignUp.email,
               password: userSignUp.password,
               confirmPassword: userSignUp.confirmPassword,
          })

          await connectToDatabase()

          await User.create({
               ...user,
               password: await bcrypt.hash(user.password, 5),
          })

          return { success: true, message:"User created successfully" }
     } catch (error) {
          return { success: false, error: formatError(error) }
     }
}



// UPDATE

export async function updateUserName(user: IUserName) {
  try {
    await connectToDatabase()
   const session = await auth()
   const currentUser = await User.findById(session?.user?.id)
   if (!currentUser) {
     throw new Error('User not found')
   }
   currentUser.name = user.name
    const updatedUser = await currentUser.save()
    revalidatePath('/admin/users')
    return {
      success: true,
      message: 'User updated successfully',
      data: JSON.parse(JSON.stringify(updatedUser)),
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}