<template>

    
                    <form class="row">
                            <input
                                v-model="todo"
                                type="text"
                                name="todo"
                                id="todo"
                                placeholder="Enter New Todo"
                                autocomplete="off"
                            />
                            <button @click="save" class="add">Add</button>
                    </form>
                <div class="form-group"></div>
                <div class="container">
        <div v-if="ToDos.length">
                <ul>
                    <li
                        v-for="(todo,index) in ToDos"
                        v-bind:key="index"
                    >
                            <span
                                v-bind:style="todo.done ? 'text-decoration:line-through;' : ''"
                            >{{ todo.todo }}</span>

                            <button @click="delete_todo(todo.id)" class="delete">Delete</button>
                    </li>
                </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            todo: "",
            ToDos: [],
            errors: [],
            newTodo: {
                todo: "",
                done: false
            },
            responseData: null,
            input_errors: []
        };
    },
    mounted() {
        this.getTodos();
    },
    methods: {
        async getTodos() {
            try {
                const response = await this.$axios.get("/todos");
                this.ToDos = response.data;
            } catch (error) {
                this.errors.push(error);
            }
        },
        async save() {
            if (this.input_errors.length > 0 || this.todo == '') {
                if (this.todo == '' && this.input_errors.length == 0)
                    this.input_errors.push('ToDo field cannot be left blank')
                this.input_errors.forEach((value) => {
                    this.$notify(value);
                });
            } else {
                try {
                    this.newTodo.todo = this.todo;
                    const response = await this.$axios.post("/todos", this.newTodo);
                    this.responseData = response.data;
                } catch (error) {
                    this.errors.push(error);
                }
                this.getTodos();
                this.$notify("Added Succesfully");
                this.todo = "";
            }
        },
        async delete_todo(index) {
            try {
                const response = await this.$axios.delete("/todos/" + index);
                this.responseData = response.data;
            } catch (error) {
                this.errors.push(error);
            }
            this.getTodos();
            this.$notify("Deleted Succesfully");
        },
        async done_todo(todo) {
            try {
                const response = await this.$axios.put("/todos/" + todo.id, { "todo": todo.todo, "done": !todo.done });
                this.responseData = response.data;
            } catch (error) {
                this.errors.push(error);
            }
            this.getTodos();
            this.$notify("Updated Succesfully");
        },
    },
    watch: {
        todo(val) {
            this.input_errors = [];
            if (val == '') {
                this.input_errors.push('ToDo field cannot be left blank')
                return;
            }
            if (val.length < 3 || val.length > 40) {
                this.input_errors.push('ToDo field be Minimum 6, Maximum 25 characters')
                return;
            }
        }
    }
};
</script>