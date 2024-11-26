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
        cout<<"Area of Circle is : "<<area(r);
        cout<<"\n\nEnter the length and breadth : ";
        cin>>l>>b;
        cout<<"Area of Rectangle is : "<<area(l,b);
    }

    float area(float radius)
    {
        return 3.14*radius*radius;
    }

    float area(float breadth,float width)
    {
        return breadth*width;
    }
};

int main()
{
    A test;
    return 0;
}