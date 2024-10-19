const apiData = [
    {
      name: "Get All Users",
      requestUrl: {
        URL: "/api/employees", response: [
          {
            total: 10,
            total_pages: 1,
            employees: [
              {
                id: 1,
                firstName: "John",
                lastName: "Doe",
                email: "johndoe@example.com",
                role: "Software Engineer",
                location: "London",
                salary: 85000,
              },
              {
                id: 2,
                firstName: "Jane",
                lastName: "Smith",
                email: "janesmith@example.com",
                role: "Software Engineer",
                location: "India",
                salary: 90000,
              },
              {
                id: 3,
                firstName: "Emily",
                lastName: "Johnson",
                email: "emilyjohnson@example.com",
                role: "Product Manager",
                location: "San Francisco",
                salary: 95000,
              },
              {
                id: 4,
                firstName: "Michael",
                lastName: "Brown",
                email: "michaelbrown@example.com",
                role: "QA Engineer",
                location: "Sent Loi",
                salary: 78000,
              },
              {
                id: 5,
                firstName: "Jessica",
                lastName: "Wilson",
                email: "jessicawilson@example.com",
                role: "QA Engineer",
                location: "Chicago",
                salary: 80000,
              },
              {
                id: 6,
                firstName: "David",
                lastName: "Taylor",
                email: "davidtaylor@example.com",
                role: "HR Manager",
                location: "London",
                salary: 60000,
              },
              {
                id: 7,
                firstName: "Daniel",
                lastName: "Anderson",
                email: "danielanderson@example.com",
                role: "Frontend Developer",
                location: "London",
                salary: 85000,
              },
              {
                id: 8,
                firstName: "Sarah",
                lastName: "Martinez",
                email: "sarahmartinez@example.com",
                role: "Backend Developer",
                location: "San Francisco",
                salary: 87000,
              },
              {
                id: 9,
                firstName: "Robert",
                lastName: "Thomas",
                email: "robertthomas@example.com",
                role: "Product Manager",
                location: "San Francisco",
                salary: 96000,
              },
              {
                id: 10,
                firstName: "Laura",
                lastName: "Garcia",
                email: "lauragarcia@example.com",
                role: "Marketing Specialist",
                location: "Chicago",
                salary: 65000,
              },
            ],
          },
        ],
      },
      requestType: "GET",
      responseCode: 200,
  
    },
    {
      name: "Get single User By Id",
      requestUrl: {
        URL: "/api/employee/1", response: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@example.com",
          role: "Software Engineer",
          location: "London",
          salary: 85000,
        }
      },
      requestType: "GET",
      responseCode: 200,
    },
    {
      name: "Get users By roles",
      requestUrl: {
        URL: "/api/employees?role=Software Engineer", response: {
          "total": 2,
          employees: [
            {
              id: 1,
              firstName: "John",
              lastName: "Doe",
              email: "johndoe@example.com",
              role: "Software Engineer",
              location: "London",
              salary: 85000,
            },
            {
              id: 2,
              firstName: "Jane",
              lastName: "Smith",
              email: "janesmith@example.com",
              role: "Software Engineer",
              location: "London",
              salary: 90000,
            },
          ],
        },
      },
      requestType: "GET",
      responseCode: 201,
  
    },
    {
      name: "Get users By roles and Locations",
      requestUrl: {
        URL: "/api/employees?role=QAEngineer&location=Chicago", response: {
          employees: [
            {
              id: 4,
              firstName: "Michael",
              lastName: "Brown",
              email: "michaelbrown@example.com",
              role: "QA Engineer",
              location: "London",
              salary: 78000,
            },
            {
              id: 5,
              firstName: "Jessica",
              lastName: "Wilson",
              email: "jessicawilson@example.com",
              role: "QA Engineer",
              location: "London",
              salary: 80000,
            },
  
          ]
        },
      },
      requestType: "GET",
      responseCode: 202,
    },
    {
      name: "Create User",
      requestUrl: {
        URL: "/api/employees/create",
        response: {
          id: 11,
          firstName: "Alice",
          lastName: "Johnson",
          email: "alicejohnson@example.com",
          role: "QA Engineer",
          location: "London",
          salary: 75000,
          message: "Employee created successfully.",
        }
      },
      responseCode: 201,
      requestType: "POST",
      request: {
        body: {
          firstName: "Alice",
          lastName: "Johnson",
          email: "alicejohnson@example.com",
          role: "QA Engineer",
          location: "London",
          salary: 75000,
        },
      },
  
    },
    {
      name: "Update user",
      requestUrl: {
        URL: "/api/employees/update/11", response: {
          id: 11,
          firstName: "Alice",
          lastName: "Johnson",
          email: "alicejohnson@example.com",
          role: "Senior QA Engineer",
          location: "London",
          salary: 80000,
          message: "Employee updated successfully.",
        },
      },
      requestType: "PUT",
      request: {
        pathParameter: { id: 11 },
       
        body: {
          firstName: "Alice",
          lastName: "Johnson",
          email: "alicejohnson@example.com",
          role: "Senior QA Engineer",
          location: "London",
          salary: 80000,
        },
      },
      responseCode: 200,
  
    },
    {
      name: "Update User By Patch ",
      requestUrl: {
        URL: "/api/employees/update/11", response: {
          id: 11,
          firstName: "Alice",
          lastName: "Johnson",
          email: "alicejohnson@example.com",
          role: "Senior QA Engineer",
          location: "London",
          salary: 82000,
          message: "Employee salary updated successfully.",
        },
      },
      requestType: "PATCH",
      request: {
        pathParameter: { id: 11 },
       
        body: { salary: 82000 },
        
      },
      responseCode: 200,
  
    },
    {
      name: "Delete the User",
      requestUrl: { URL: "/api/employees/{id}", response: null, },
      requestType: "DELETE",
  
      responseCode: 204,
      // No content response
    },
    {
      name: "Get Request with Using BR token",
      requestUrl: {
        URL: "/api/employee/assets",
        response: {
  
          assetName: "Laptop",
          assetType: "Electronics",
          assignedDate: "2024-01-15",
          status: "Assigned",
        }
      },
     
      requestType: "GET",
      request: {
        headers: { Authorization: " Bearer VISHU" },
      },
      responseCode: 200,
  
    },
    {
      name: "Create Something with Autherization",
      requestUrl: {
        URL: "/api/employee/assets/add",
        response: {
          assetName: "Car",
          assetType: "Vehicle",
          assignedDate: "2024-10-01",
          status: "Assigned",
        }
      },
      requestType: "POST",
      request: {
        headers: {
          Authorization: "Basic aXNodTppczEyMw==",
          "Content-Type": "application/json",
        },
        body: {
          assetName: "Car",
          assetType: "Vehicle",
          assignedDate: "2024-10-01",
          status: "Assigned",
        },
        responseCode: 201
      },
  
    },
    {
      name: "Delete with Autherization",
      requestUrl: {
        URL: "/api/employee/123/assets/remove/234",
        response: {
          message: "Asset removed from employee successfully.",
        },
      },
      requestType: "DELETE",
   
      request: {
        headers: {
          Authorization: "Basic 2a3e6f7a93e4f3a8b98f2e1c24ef5f8a"
         
        },
      },
      responseCode: 200,
  
    },
  ];
  
  module.exports = apiData;
  
