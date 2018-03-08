<template>
  <div class="container">
    <el-row>
      <el-col>
        <div>
          <el-button type="primary" class="btn-right" @click="add">添加公司</el-button>
        </div>
        <div>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark">
            <el-table-column prop="name" label="公司名称"></el-table-column>
            <el-table-column prop="short_name" label="公司短语" show-overflow-tooltip></el-table-column>
            <el-table-column prop="found_time" label="创立时间"></el-table-column>
            <el-table-column prop="address" label="公司地址" show-overflow-tooltip></el-table-column>
            <el-table-column prop="short_address" label="短地址"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="fax" label="传真"></el-table-column>
            <el-table-column prop="nationwide_phone" label="全国热线"></el-table-column>
            <!-- <el-table-column prop="description" label="描述">
              <template slot-scope="scope">
                <div class="description" v-html="scope.row.description"></div>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="destory(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination layout="prev, pager, next" :total="total" @current-change="pageChange"> </el-pagination>
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import Interface from "@/util/interface.js";
  export default {
    data() {
      return {
        tableData: [],
        total: 1,
        currentPage: 1
      };
    },
    methods: {
      fetch(scence) {
        if ("list" == scence) {
          Interface.getData("get", Interface.website.company.get).then(res => {
            if (res.data.code == 200) {
              this.tableData = res.data.data;
              this.tableData.forEach(val => {
                val.found_time = Interface.getTime(val.found_time);
              });
            }
          });
        }
      },
      add() {
        this.$router.push("/company/add");
      },
      edit(row) {
        this.$router.push("/company" + "/" + row.id);
      },
      destory(row) {
        console.log(row.id);
        this.$confirm("是否确定要删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            let param = {
              _method: "delete"
            };
            Interface.getData(
              "post",
              Interface.website.company.post + "/" + row.id,
              param
            ).then(res => {
              if (res.data.code == 200) {
                this.$message.success("删除成功");
                this.fetch("list");
              } else {
                this.$message.error("删除失败");
              }
            });
          })
          .catch(() => {
            this.$message.error("取消删除");
          });
      },
      pageChange(num) {
        this.currentPage = num;
      }
    },
    created() {
      this.fetch("list");
    }
  };

</script>
<style lang="scss">
  @import "../../../../assets/css/container.css";
  .description {
    width: 100px;
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-line-clamp: 1
  }

</style>
