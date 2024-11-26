#include<iostream>

using namespace std;

class Overloading
{
    private:
        int x,y,z;

    public:
        Overloading()
        {
            cout<<"Enter x,y,z : ";
            cin>>x>>y>>z;

        }

        void operator-()
        {
            x=-x;
            y=-y;
            z=-z;
        }

        void display()
        {
            cout<<"\nx = "<<x;
            cout<<"\ny = "<<y;
            cout<<"\nz = "<<z;
        }
};

int main()
{
    Overloading a;
    -a;
    a.display();
    return  0;
}