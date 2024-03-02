<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CrudApi extends CI_Controller {
    public function __construct() {
        parent::__construct();
      
        $this->load->library('form_validation');
        $this->load->helper('json_output');
        $this->load->library('encryption');
        $this->load->library('jwt'); 

        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        $this->load->database();
     
    }

    function login() {
 

        $json = file_get_contents('php://input');
        $data = json_decode($json);
    
        if (isset($data)) {
            $username = $data->username;
            $password = $data->password;

            $authenticated = $this->db->get_where('faceapi_user', array('email' => $username, 'password' => md5($password)));
    
            if ($authenticated->num_rows() > 0) {
            
                $response = array(
                    'status' => 'success',
                );
                json_output($response);
            } else {
                // Authentication failure
                $response = array(
                    'status' => 'failure',
                    'message' => 'Invalid credentials'
                );
                json_output($response);
            }
        } else {
            json_output(['status' => 400, 'message' => 'Bad Request']);
        }
        
    }
    




    public function post() {
    $json = file_get_contents('php://input');
    $data = json_decode($json);

    if (isset($data)) {
        $post = $data->post;
        $email = $data->email;
        $phone = $data->phone;
        $this->load->database();

        $insert_data = array(
            'post' => $post,
            'email' => $email,
            'phone' => $phone
        );

        $this->db->insert('new', $insert_data);

        if ($this->db->affected_rows() > 0) {
            $response = array(
                'status' => 'success',
                'message' => 'successfully created'
            );
        } else {
            $response = array(
                'status' => 'failure',
                'message' => 'Failed to create'
            );
        }

        json_output($response);
    } else {
        json_output(['status' => 400, 'message' => 'Bad Request']);
    }

    }



    public function display() {
        $this->load->database();
        $query = $this->db->get('new');
        $result = $query->result();
    
        if ($result) {
            $response = array(
                'status' => 'success',
                'data' => $result
            );
        } else {
            $response = array(
                'status' => 'failure',
                'message' => 'No records found'
            );
        }
    
        json_output($response);
    }
     



    public function delete() {

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: DELETE");
        $json = file_get_contents('php://input');
        $data = json_decode($json);
    
        if (isset($data->id)) {
            $id = $data->id;
            $this->load->database();
    
            $this->db->where('id', $id);
            $this->db->delete('new');
    
            if ($this->db->affected_rows() > 0) {
                $response = array(
                    'status' => 'success',
                    'message' => 'Record deleted successfully'
                );
            } else {
                $response = array(
                    'status' => 'failure',
                    'message' => 'Record not found or failed to delete'
                );
            }
    
            json_output($response);
        } else {
            json_output(['status' => 400, 'message' => 'Bad Request']);
        }
    }


    public function update() {
    
        $id=$_GET['id'];
        if ($id) {
            $this->load->database();
            $this->db->select('*'); 
            $this->db->where('id', $id);
            $query = $this->db->get('new');
            $result = $query->row_array();
    
            if ($result) {
                $response = array(
                    'status' => 'success',
                    'data' => $result,
                    'id' => $id
                );
            } else {
                $response = array(
                    'status' => 'failure',
                    'data' => 'Record not found',
                    'id' => $id
                );
            }
    
            json_output($response);
        } else {
            json_output(['status' => 400, 'message' => 'Bad Request']);
        }
    }
    

    function update_data(){

        $json = file_get_contents('php://input');
        $data = json_decode($json);
    
        if (isset($data)) {
            $id = $data->id;
            $post = $data->post;
            $email = $data->email;
            $phone = $data->phone;
            $this->load->database();
            $insert_data = array(
                'post' => $post,
                'email' => $email,
                'phone' => $phone
            );
            $this->db->where('id', $id);
            $this->db->update('new', $insert_data);
    
            if ($this->db->affected_rows() > 0) {
                $response = array(
                    'status' => 'success',
                    'message' => 'successfully updated'
                );
            } else { 
                $response = array(
                    'status' => 'failure',
                    'message' => 'Failed to update'
                );
            }
    
            json_output($response);
        } else {
            json_output(['status' => 400, 'message' => 'Bad Request']);
        }
    
    
}
}