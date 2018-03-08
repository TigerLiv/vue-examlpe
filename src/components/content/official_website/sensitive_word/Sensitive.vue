<template>
  <div class="container">
    <el-col>
        <el-input v-model="addWord"  placeholder="请输入内容" style="width: 300px;"></el-input><el-button type="primary"  @click="add()">添加敏感词</el-button>
    </el-col>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="id"  width="180"></el-table-column>
      <el-table-column prop="word" label="敏感词" width="180"></el-table-column>
      <el-table-column prop="address" label="操作">
         <template slot-scope="scope">
          <el-button @click="deletes(scope.row)" type="danger" size="small">删除</el-button> 
          <el-button  @click="editid(scope.row,dialogVisible= true);" type="primary"  size="small">编辑</el-button>
         </template>
      </el-table-column>
    </el-table>
    <el-col class="pagination">
        <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="30"
            @current-change="pageChange"
            >
        </el-pagination>
    </el-col>
    <el-dialog
      title="编辑敏感词"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-input v-model="editInput" placeholder="请输入内容" class="add" style="width: 400px;"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="btn" type="primary" @click="edit(dialogVisible = false);">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
import Interface from "@/util/interface.js";
export default {
  data() {
    return {
      tableData: [
        {
          id: "",
          word: ""
        }
      ],
      pageSize: 30,
      currentPage: 1,
      total: 0,
      addWord: "",
      searchInput: "",
      dialogVisible: false,
      editInput: "",
      editId: ""
    };
  },
  methods: {
    fetch() {
      let params = {
        page: this.currentPage,
        pageSize: this.pageSize
      };
      Interface.getData(
        "get",
        Interface.website.sensitiveWord.get,
        params
      ).then(res => {
        if (res.data.code == 200) {
          let data = res.data.data.data;
          this.total = res.data.data.total;
          this.tableData = data;
        }
      });
    },
    pageChange(num) {
      this.currentPage = num;
      this.fetch();
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    deletes(row) {
      let id = row.id;
      let params = {
        _method: "delete"
      };
      this.$confirm("是否确定要删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        Interface.getData(
          "post",
          Interface.website.sensitiveWord.post + "/" + id,
          params
        )
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success("删除成功！");
              this.fetch();
            } else {
              this.$message.success("删除失败！");
            }
          })
          .catch(() => {
            self.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      });
    },
    editid(row) {
      this.editId = row.id;
    },
    edit() {
      var self = this;
      let params = {
        word: self.editInput,
        _method: "put"
      };
      var id = this.editId;
      if (params.word != null) {
        Interface.getData(
          "post",
          Interface.website.sensitiveWord.post + "/" + id,
          params
        ).then(res => {
          if (res.data.code == 200) {
            this.$message.success("修改成功！");
            setTimeout(() => {
              this.fetch();
            }, 500);
          }
        });
      } else {
        this.$message.success("修改失败！");
      }
    },
    add() {
      var self = this;
      let params = {
        word: self.addWord
      };
      Interface.getData(
        "post",
        Interface.website.sensitiveWord.post,
        params
      ).then(res => {
        if (res.data.code == 200) {
          this.$message.success("添加成功！");
        } else {
          this.$message.error("添加失败");
        }
      });
    }
  },
  created() {
    this.fetch();
  }
};
</script>
<style scoped>
.el-button--primary {
  margin-left: 20px !important;
}
</style>