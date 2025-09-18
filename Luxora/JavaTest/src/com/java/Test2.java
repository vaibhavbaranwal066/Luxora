package com.java;

public class Test2 {
	public static void main(String[] args) {
		// Assume we have a two strings string1="abcdcd" and string2 = "cdefd" 
		// then output should be result = cdd
		
		B obj = new A();
		A obj  = new B();
		obj.display();
		
		String string1 = "ccdefd";
		String string2 = "abcdcd";
		
		StringBuilder result = new StringBuilder();
		StringBuilder tempString = new StringBuilder(string2);
		
		for(char ch : string1.toCharArray()) {
			int i = tempString.indexOf(String.valueOf(ch));
			if(i != -1)
			{
				result.append(ch);
				tempString.deleteCharAt(i);
			}
		}
		
		System.out.println(result);
		
		// Interface1.super().test();
	}

}

class A
{
void display(){System.out.println("print A");}
}
class B extends A
{
void display(){System.out.println("print A");}
}

