package edu.upc.dsa.services;

import edu.upc.dsa.UserList;
import edu.upc.dsa.UserListImpl;
import edu.upc.dsa.models.User;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import javax.ws.rs.*;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Api(value = "/users", description = "Endpoint to User Service")
@Path("/users")
public class UsersService {
    private UserList ul;

    public UsersService() {
        this.ul = UserListImpl.getInstance();
        initializeAdminUser();
    }
    private void initializeAdminUser() {
        if (ul.size() == 0) {
            ul.addUser(new User("admin", "admin"));
            // Asegúrate de que "addUser" realmente añade el usuario a la lista
            // y que la implementación del usuario maneja correctamente la adición.
        }
    }

    @GET
    @ApiOperation(value = "get all Users", notes = "---")//Que ponemos en notes?
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Successful", response = User.class, responseContainer = "List")
    })
    @Path("/getUsers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsers() {
        List<User> users = this.ul.getUsers();

        GenericEntity<List<User>> entity = new GenericEntity<List<User>>(users) {};
        return Response.status(201).entity(entity).build();
    }
    @GET
    @ApiOperation(value = "get User", notes = "---")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Successful", response = User.class),
            @ApiResponse(code = 404, message = "User not found")
    })
    @Path("/getUser/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("id") String id) {
        User user = this.ul.getUser(id);
        if(user==null) return Response.status(404).build();
        else return Response.status(201).entity(user).build();
    }

    @POST
    @ApiOperation(value = "create a new User", notes = "---")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Successful", response=User.class),
            @ApiResponse(code = 500, message = "Validation error")
    })
    @Path("/newUser")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response newUser(User user) {
        User newUser = new User(user.getUserName(), user.getPassword());
        if(newUser.getUserName()==null || newUser.getPassword()==null) return Response.status(500).entity(newUser).build();
        this.ul.addUser(newUser);
        return Response.status(201).entity(newUser).build();
    }


    @PUT
    @ApiOperation(value = "update User Password", notes = "---")
    @ApiResponses(value = {
            @ApiResponse(code = 201, message = "Successful"),
            @ApiResponse(code = 404, message = "User not found")
    })
    @Path("/updateUserPassword")
    public Response updateUserPassword(User user) {
        User u = this.ul.updatePassword(user,user.getPassword());
        if(u==null) return Response.status(404).build();
        return Response.status(201).build();
    }


    @POST //Utilizamos POST ya que al usar metodos de autentificacion es más seguro
    @ApiOperation(value = "User Login", notes = "Verifies user credentials.")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Login Successful"),
            @ApiResponse(code = 401, message = "Unauthorized")
    })
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(User user) {
        if (ul.authenticateUser(user.getUserName(), user.getPassword())) {
            return Response.status(201).build();
        } else {
            return Response.status(401).build();
        }
    }



}
