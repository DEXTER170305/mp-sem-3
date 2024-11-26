#include<iostream>

using namespace std;

class A
{
    private:
        float r,l,b;

    public:
    A()
    {
        cout<<"Enter the radius : ";
        cin>>r;
        cout<<"Area of Circle is : "<<perimeter(r);
        cout<<"\n\nEnter the length and breadth : ";
        cin>>l>>b;
        cout<<"Area of Rectangle is : "<<perimeter(l,b);
    }

    float perimeter(float radius)
    {
        return 3.14*2*radius;
    }

    float perimeter(float breadth,float width)
    {
        return 2*(breadth+width);
    }
};

int main()
{
    A test;
    return 0;
}