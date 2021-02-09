import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag'
import {
    Grid, List, ListItem,
     ListItemSecondaryAction,
    IconButton, Modal, CircularProgress,
    Button, TextField
} from '@material-ui/core';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign: 'center',
        },
        parent: {
            textAlign: 'center'
        },
        dataDisplay: {
            backgroundColor: 'rgb(217, 243, 252)',
            marginTop: '30px',
            marginBottom: '20px',
            width: '100%',
            padding: '15px',
            // border: '1px solid blue',
            borderRadius: '5px'
        },
        textField: {
            marginTop: '8px',
            width: '100%',
            textAlign: 'center',
        },
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }),
);


const gettodos = gql`
{
    todos{
        id
        name
  }
}
`

const addtodo = gql`
    mutation CreateATodo($name:String){
        addtodo(name:$name){
            id
            name
        }
    }
`

const updatetodo = gql`
    mutation UpdateTodo($id:String,$name:String){
        updatetodo(id:$id,name:$name){
            name
        }
    }
`

const deletetodo=gql`
    mutation DeleteTodo($id:String){
        deletetodo(id:$id){
            name
        }
    }
`


function rand() {
    return Math.round(Math.random() * 10) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        alignItems: "center", justifyContent: "center" 
    };
}


const schema = Yup.object({
    name: Yup.string()
        .required("Todo is required")
        .min(3, 'Todo Item Must be greater than or equals to 3 characters'),
    
})

export interface todosProps {

}

const Todos: React.SFC<todosProps> = () => {
    const classes = useStyles();
    const { loading, error, data } = useQuery(gettodos);
    const [addTodo] = useMutation(addtodo);
    const [updateTodo] = useMutation(updatetodo);
    const [deleteTodo] = useMutation(deletetodo);
    const [open, setOpen] = React.useState(false);
    const [currentId, setCurrentId] = React.useState(null);
    const [currentName, setCurrentName] = React.useState(null);
    

    const [modalStyle] = React.useState(getModalStyle);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div>
                <div>
                    <Formik
                        initialValues={{ name: "" }}
                        validationSchema={schema}
                        onSubmit={(value, { resetForm }) => {
                            console.log('name', value.name)
                          

                            addTodo({ variables: { name: value.name }, refetchQueries: [{ query: gettodos }] })

                            resetForm();
                            setCurrentId(null);
                            setCurrentName("")
            
                        }}>

                        {(formik: any) => (
                            <Form onSubmit={formik.handleSubmit}>
                                <Grid container justify="center">
                                    <Grid item xs={12} sm={6}>
                                        <div style={{marginTop: '5%'}}>
                                            <Field
                                                type='name'
                                                fullWidth
                                                as={TextField}
                                                variant="outlined"
                                                label="Todo Item"
                                                name="name"
                                                id="name"
                                                className={classes.textField}
                                            />
                                            <div></div>
                                            <ErrorMessage name='name' render={(msg: string) => (
                                                <span style={{ color: "red", fontSize: '18sp' }}>{msg}</span>
                                            )} />
                                           <div></div>
                                        </div>

                                        <div>
                                            <Button variant="text"
                                            style={{backgroundColor: 'rgb(217, 243, 252)', padding: '20px', borderRadius: '20px',
                                                    color: "black", boxShadow: '2px 2px 3px black',
                                                    letterSpacing: "2px", fontSize: '15px', border: '1px solid black',
                                                    marginTop: '50px'}}
                                             color="inherit" type="submit"
                                              className={classes.textField}
                                              >
                                                Add Todo
                                        </Button>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}

                    </Formik>
                </div>
            </div>
            <div>
                {loading && <CircularProgress style={{color: 'black',
            marginTop: '30px'}} />}
                {data && 
                    <Grid container justify="center">
                        
                        <Grid item xs={12} sm={6}>
                        
                            {
                                <List>
                                    {data.todos.map(todo => (
                                        <ListItem key={todo.id} className={classes.dataDisplay}>
                                            <FormatListBulletedIcon
                                              style={{color: 'black', marginRight: '15px'}}/>
                                           <p style={{color: 'black',fontSize: '22px',
                                            letterSpacing: '1px', fontWeight: 'bold'}}>{todo.name}</p>
                                            <ListItemSecondaryAction>
                                                <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="simple-modal-title"
                                                    aria-describedby="simple-modal-description"
                                                >
                                                    <div style={modalStyle} className={classes.paper}>
                                                        <Formik
                                                            initialValues={{ name: currentName, }}
                                                            validationSchema={schema}
                                                            onSubmit={(value, { resetForm }) => {
                                                                console.log('name', value.name)
                                                             
                                                                updateTodo({
                                                                    variables: {
                                                                        id: currentId,
                                                                        name: value.name,
                                                                     
                                                                    },
                                                                    refetchQueries: [{ query: gettodos }]
                                                                })
                                                                resetForm();
                                                                handleClose();
                                                                Swal.fire({
                                                                    position: 'center',
                                                                    icon: 'success',
                                                                    title: 'Todo is updated',
                                                                    showConfirmButton: false,
                                                                    timer: 1500
                                                                  })
                                                            }}>

                                                            {(formik: any) => (
                                                                <Form onSubmit={formik.handleSubmit}>
                                                                    <Grid container justify="center">
                                                                        <Grid item xs={12}>
                                                                            <div>
                                                                                <Field
                                                                                    type='name'
                                                                                    as={TextField}
                                                                                    variant="outlined"
                                                                                    label="todo Name"
                                                                                    name="name"
                                                                                    id="name"
                                                                                    className={classes.textField}
                                                                                />
                                                                                <br />
                                                                                <ErrorMessage name='name' render={(msg: string) => (
                                                                                    <span style={{ color: "red", fontSize: '18sp' }}>{msg}</span>
                                                                                )} />
                                                                                <br />
                                                                            </div>
                                                                           

                                                                            <div>
                                                                                <Button variant="contained"
                                                                                 style={{backgroundColor: 'rgb(217, 243, 252)', padding: '10px', borderRadius: '10px',
                                                                                 color: "black", boxShadow: '2px 2px 3px black',
                                                                                 letterSpacing: "2px", fontSize: '20px', border: '1px solid black'}}
                                                                                  color="inherit" type="submit" className={classes.textField} 
                                                                                >
                                                                                    Update Todo
                                                                                </Button>
                                                                            </div>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Form>
                                                            )}

                                                        </Formik>
                                                    </div>
                                                </Modal>
                                                <IconButton edge="end" aria-label="update" onClick={() => {
                                                    console.log('Update Button', todo.id);
                                                    setCurrentId(todo.id)
                                                    setCurrentName(todo.name)
                                                    handleOpen()
                                                }}>
                                                    <CreateOutlinedIcon style={{color: 'black'}}/>
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" onClick={async () => {
                                                    deleteTodo({
                                                        variables:{
                                                            id:todo.id
                                                        },
                                                        refetchQueries: [{ query: gettodos }],
                                                    })
                                                    Swal.fire({
                                                        position: 'center',
                                                        icon: 'success',
                                                        title: 'Todo is deleted',
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                      })
                                                }}>
                                                    <DeleteIcon style={{color: 'red'}}/>
                                                </IconButton>
                                            </ListItemSecondaryAction>

                                        </ListItem>
                                    ))}
                                </List>
                            }
                        </Grid>
                    </Grid>
                }
                {error && <p>Error fetching data</p>}
            </div>

        </div>

    );
}

export default Todos;